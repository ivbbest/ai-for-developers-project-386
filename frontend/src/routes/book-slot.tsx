import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { ApiError, type EventType, type Slot } from '../api/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDayLongMsk, formatTimeMsk, mskDay } from '../lib/time';
import { WINDOW_DAYS } from '../lib/window';
import { OwnerBlock } from '../components/owner-block';

function toIsoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function BookSlotPage() {
  const { typeId } = useParams<{ typeId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reqSeq = useRef(0);
  const [type, setType] = useState<EventType | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // «Сегодня» — по поясу сервиса: вечером в MSK вчерашний день уже недоступен
  const today = useMemo(() => new Date(`${mskDay(new Date().toISOString())}T00:00:00`), []);
  const lastDay = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + WINDOW_DAYS - 1);
    return d;
  }, [today]);

  useEffect(() => {
    if (!typeId) return;
    api
      .listEventTypes()
      .then((list) => {
        const found = list.find((t) => t.id === typeId);
        if (!found) setLoadError('Тип события не найден');
        else setType(found);
      })
      .catch(() => setLoadError('Не удалось загрузить тип события'));
  }, [typeId]);

  const loadSlots = (d: Date) => {
    if (!typeId) return;
    setDay(d);
    setSelected(null);
    setSlots(null);
    setLoadError(null);
    // ответ за прежний день не должен перезаписать новый при быстрой смене даты
    const seq = ++reqSeq.current;
    api
      .getSlots(typeId, toIsoDay(d))
      .then((list) => {
        if (seq === reqSeq.current) setSlots(list);
      })
      .catch((e: unknown) => {
        if (seq !== reqSeq.current) return;
        setSlots([]);
        setLoadError(e instanceof ApiError ? e.message : 'Не удалось загрузить слоты');
      });
  };

  // возврат из /confirm («Изменить», «Обновить слоты») — на тот же день
  useEffect(() => {
    const date = searchParams.get('date');
    if (type && date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      loadSlots(new Date(`${date}T00:00:00`));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  if (loadError && type === null) return <p className="text-destructive">{loadError}</p>;
  if (type === null) return <Skeleton className="h-40" />;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">{type.title}</h1>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="grid gap-4 pt-6">
            <OwnerBlock />
            <div>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{type.title}</h2>
                <Badge variant="secondary">{type.durationMinutes} мин</Badge>
              </div>
              {type.description ? (
                <p className="mt-1 text-sm text-muted-foreground">{type.description}</p>
              ) : null}
            </div>
            <InfoBox
              label="Выбранная дата"
              value={day ? formatDayLongMsk(`${toIsoDay(day)}T12:00:00Z`) : 'Дата не выбрана'}
            />
            <InfoBox
              label="Выбранное время"
              value={selected ? `${formatTimeMsk(selected.start)} - ${formatTimeMsk(selected.end)}` : 'Время не выбрано'}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Календарь</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              defaultMonth={today}
              selected={day ?? undefined}
              onSelect={(d) => d && loadSlots(d)}
              startMonth={today}
              endMonth={lastDay}
              disabled={(d) => d < today || d > lastDay}
              weekStartsOn={1}
              locale={{ code: 'ru-RU' }}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Статус слотов</CardTitle>
            {day === null ? <CardDescription>Выберите дату в календаре</CardDescription> : null}
          </CardHeader>
          <CardContent>
            {day !== null && slots === null && <Skeleton className="h-40" />}
            {day !== null && slots !== null && slots.length === 0 && (
              <p className="text-sm text-muted-foreground">Нет слотов на этот день</p>
            )}
            {day !== null && slots !== null && slots.length > 0 && (
              <div className="grid max-h-96 gap-2 overflow-y-auto">
                {slots.map((s) => (
                  <button
                    key={s.start}
                    type="button"
                    disabled={s.status === 'booked'}
                    onClick={() => setSelected(s)}
                    aria-pressed={selected?.start === s.start}
                    className={
                      'flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ' +
                      (s.status === 'booked'
                        ? 'cursor-not-allowed bg-muted/60 text-muted-foreground'
                        : selected?.start === s.start
                          ? 'border-primary bg-primary/10'
                          : 'hover:border-primary/60')
                    }
                  >
                    <span className="tabular-nums">
                      {formatTimeMsk(s.start)} - {formatTimeMsk(s.end)}
                    </span>
                    <span className={s.status === 'booked' ? 'text-muted-foreground' : 'font-medium'}>
                      {s.status === 'booked' ? 'Занято' : 'Свободно'}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {loadError && day !== null && <p className="mt-2 text-sm text-destructive">{loadError}</p>}
            <div className="mt-4 flex gap-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/book">Назад</Link>
              </Button>
              <Button
                className="flex-1"
                disabled={selected === null}
                onClick={() =>
                  typeId &&
                  selected &&
                  navigate(`/book/${typeId}/confirm?start=${encodeURIComponent(selected.start)}`)

                }
              >
                Продолжить
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 px-3 py-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

