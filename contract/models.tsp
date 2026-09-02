// Модели контракта — строго по docs/specs/api-contract.md («Доменные сущности»).
// Owner — не модель, а @doc на админ-интерфейсе (routes.tsp): unreferenced-модель
// не попадает в сгенерированный openapi.yaml (аудит N4).
import "@typespec/http";

using TypeSpec.Http;

@pattern("^[a-z0-9-]{1,40}$", "идентификатор типа события: строчные буквы, цифры, дефисы")
@doc("Читаемый id типа события; задаёт владелец, уникален (C5)")
scalar EventTypeId extends string;

@minValue(5)
@maxValue(540)
@doc("Длительность в минутах: 5–540, кратно 5 (E12; делимость проверяет бэкенд — в OpenAPI/TypeSpec 1.15 нет multipleOf)")
scalar DurationMinutes extends int32;

@minLength(1)
@maxLength(80)
@doc("Название типа события")
scalar EventTitle extends string;

@maxLength(500)
@doc("Описание типа события")
scalar EventDescription extends string;

@minLength(1)
@maxLength(120)
@doc("Имя гостя; сервер нормализует trim (E10)")
scalar GuestName extends string;

@format("email")
@doc("Email гостя; валидация простая, регистр сохраняется (E11)")
scalar GuestEmail extends string;

@maxLength(2000)
@doc("Заметки гостя к брони")
scalar BookingNotes extends string;

@doc("Тип события: что можно забронировать")
model EventType {
  @doc("Читаемый id, паттерн ^[a-z0-9-]{1,40}$ (C5)")
  id: EventTypeId;

  title: EventTitle;

  description?: EventDescription;

  durationMinutes: DurationMinutes;
}

@doc("Статус слота: свободен/занят (пересечение с бронями)")
enum SlotStatus {
  available: "available",
  booked: "booked",
}

@doc("Слот сетки дня. Сетка: от 09:00 MSK с шагом durationMinutes, пока end <= 18:00 MSK; прошедшие слоты текущего дня исключены; занятые возвращаются со статусом booked")
model Slot {
  @doc("Начало (UTC)")
  start: utcDateTime;

  @doc("Конец (UTC)")
  end: utcDateTime;

  @doc("available — свободен, booked — занято пересечением с бронью")
  status: SlotStatus;
}

@doc("Бронирование")
model Booking {
  @format("uuid")
  @doc("Server-side uuid (C5)")
  id: string;

  @doc("Тип события")
  eventTypeId: EventTypeId;

  @doc("Начало (UTC)")
  start: utcDateTime;

  @doc("Конец: сервер вычисляет start + durationMinutes типа (клиент не шлёт)")
  end: utcDateTime;

  name: GuestName;

  email: GuestEmail;

  notes?: BookingNotes;

  @doc("Момент создания брони (UTC)")
  createdAt: utcDateTime;
}

@doc("Тело POST /api/bookings: end сервер считает сам")
model BookingCreate {
  eventTypeId: EventTypeId;

  @doc("Начало слота из сетки типа; вне сетки — 400 (E7)")
  start: utcDateTime;

  name: GuestName;

  email: GuestEmail;

  notes?: BookingNotes;
}

@doc("Код ошибки: validation→400, not_found→404, slot_conflict→409, slot_out_of_window→400, payload_too_large→413 (C7)")
enum ErrorCode {
  validation: "validation",
  not_found: "not_found",
  slot_conflict: "slot_conflict",
  slot_out_of_window: "slot_out_of_window",
  payload_too_large: "payload_too_large",
}

@error
@doc("Единая модель ошибок: все ответы /api/* (4xx/5xx) — только она (C7, E18–E19); message — человекочитаемый, RU")
model Error {
  code: ErrorCode;

  @doc("Человекочитаемое сообщение на русском")
  message: string;
}
