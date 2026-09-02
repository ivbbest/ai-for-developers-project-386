#!/usr/bin/env bash
# Смоук стаба (шаг 2.1b): стейтфул-сценарий контракта на in-memory mock —
# «бронь → слот стал booked → повтор 409 → новый тип виден в каталоге»,
# плюс коды ошибок всех 5 ручек. Даты считаются на завтра (MSK), чтобы
# прогон не устаревал.
# Прогон: ./scripts/dev.sh npm run smoke -w @cal-com/mock-server
set -u
cd "$(dirname "$0")"

PORT="${MOCK_SMOKE_PORT:-4021}"
BASE="http://localhost:${PORT}/api"
BODY=$(mktemp)
SRV=""
FAILS=0

cleanup() {
  [ -n "$SRV" ] && kill "$SRV" 2>/dev/null
  rm -f "$BODY"
}
trap cleanup EXIT

check() {
  local name="$1" want="$2"; shift 2
  local got
  got=$(curl -s -o "$BODY" -w '%{http_code}' "$@")
  if [ "$got" = "$want" ]; then echo "PASS  $name → $got"; else echo "FAIL  $name → want $want, got $got"; head -c 200 "$BODY"; echo; FAILS=$((FAILS + 1)); fi
}

check_body() {
  local name="$1" pattern="$2"
  if grep -q "$pattern" "$BODY"; then echo "PASS  $name"; else echo "FAIL  $name (body lacks $pattern)"; head -c 200 "$BODY"; echo; FAILS=$((FAILS + 1)); fi
}

MOCK_PORT="$PORT" node server.js >/tmp/mock-smoke.log 2>&1 &
SRV=$!

ready=0
for _ in $(seq 1 40); do
  if ! kill -0 "$SRV" 2>/dev/null; then break; fi
  if [ "$(curl -s -o "$BODY" -w '%{http_code}' "$BASE/event-types")" = "200" ]; then ready=1; break; fi
  sleep 0.5
done
if [ "$ready" != 1 ]; then echo "FAIL  стаб не поднялся на :$PORT"; cat /tmp/mock-smoke.log; exit 1; fi

# завтрашний день в MSK — гарантированно внутри окна и без прошедших слотов
TOMORROW=$(TZ=Europe/Moscow date -d "+1 day" +%F)

check "GET event-types" 200 "$BASE/event-types"
check_body "seed: 2 типа" 'meet-30'

check "GET slots meet-15" 200 "$BASE/event-types/meet-15/slots?date=$TOMORROW"
check_body "слоты доступны" '"available"'
FIRST_START=$(node -e "const j=require('fs').readFileSync('$BODY','utf8');console.log(JSON.parse(j)[0].start)")

# основной сценарий: бронь → booked → повтор 409
BOOK="{\"eventTypeId\":\"meet-15\",\"start\":\"$FIRST_START\",\"name\":\"Гость Смоук\",\"email\":\"smoke@example.com\"}"
check "POST booking → 201" 201 -H 'Content-Type: application/json' -d "$BOOK" "$BASE/bookings"
check_body "бронь с id/createdAt" '"createdAt"'
check "GET slots после брони" 200 "$BASE/event-types/meet-15/slots?date=$TOMORROW"
check_body "первый слот стал booked" '"start":"'"$FIRST_START"'","end":"[^"]*","status":"booked"'
check "повтор той же брони → 409" 409 -H 'Content-Type: application/json' -d "$BOOK" "$BASE/bookings"
check_body "409 slot_conflict" '"slot_conflict"'
check "GET bookings (админ)" 200 "$BASE/bookings"
check_body "бронь видна админу" 'smoke@example.com'

# создание типа: 201 → виден в каталоге → сетка по новой длительности → дубль 409
TYPE='{"id":"smoke-45","title":"Смоук 45 минут","durationMinutes":45}'
check "POST event-type → 201" 201 -H 'Content-Type: application/json' -d "$TYPE" "$BASE/event-types"
check "каталог после создания" 200 "$BASE/event-types"
check_body "новый тип в каталоге" 'smoke-45'
check "слоты нового типа (шаг 45)" 200 "$BASE/event-types/smoke-45/slots?date=$TOMORROW"
check_body "45-мин сетка" '"start"'
check "дубль id → 409" 409 -H 'Content-Type: application/json' -d "$TYPE" "$BASE/event-types"
check_body "409 duplicate_id" '"duplicate_id"'

# коды ошибок
check "slots без date → 400" 400 "$BASE/event-types/meet-15/slots"
check "slots кривая date → 400" 400 "$BASE/event-types/meet-15/slots?date=2026-02-30"
check "slots вне окна → 400" 400 "$BASE/event-types/meet-15/slots?date=2020-01-01"
check_body "slot_out_of_window" '"slot_out_of_window"'
check "slots нет типа → 404" 404 "$BASE/event-types/nope/slots?date=$TOMORROW"
check_body "not_found" '"not_found"'
check "booking нет типа → 404" 404 -H 'Content-Type: application/json' -d '{"eventTypeId":"nope","start":"2026-01-01T06:00:00.000Z","name":"Г","email":"g@example.com"}' "$BASE/bookings"
check "booking кривой email → 400" 400 -H 'Content-Type: application/json' -d '{"eventTypeId":"meet-15","start":"2026-01-01T06:00:00.000Z","name":"Г","email":"не-почта"}' "$BASE/bookings"
check "тип duration=7 → 400" 400 -H 'Content-Type: application/json' -d '{"id":"x-7","title":"x","durationMinutes":7}' "$BASE/event-types"
check "тип id вне паттерна → 400" 400 -H 'Content-Type: application/json' -d '{"id":"X_7","title":"x","durationMinutes":15}' "$BASE/event-types"
check "неизвестный /api/* → 404 Error" 404 "$BASE/nope"
check_body "not_found формат" '"not_found"'

if [ "$FAILS" = 0 ]; then echo "MOCK SMOKE OK: сценарий и коды пройдены"; else echo "MOCK SMOKE FAILED: $FAILS провалов"; exit 1; fi
