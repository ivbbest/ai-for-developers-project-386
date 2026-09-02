import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { ApiError, type EventType, type Slot } from '../api/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTimeMsk, formatTimeMsk, mskDay } from '../lib/time';
import { formatDuration } from '../lib/duration';
import { WINDOW_DAYS, WORK_HOURS_LABEL } from '../lib/window';

function toIsoDay(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function BookSlotPage() {
  const { typeId } = useParams<{ typeId: string }>();
  const navigate = useNavigate();
  const [type, setType] = useState<EventType | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // «Сегодня» — по поясу сервиса: вечером в MSK календарь не должен
  // показывать вчерашний день как доступный
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
    api
      .getSlots(typeId, toIsoDay(d))
      .then(setSlots)
      .catch((e: unknown) => {
        setSlots([]);
        setLoadError(e instanceof ApiError ? e.message : 'Не удалось загрузить слоты');
      });
  };

  if (loadError && type === null) return <p className="text-destructive">{loadError}</p>;
  if (type === null) return <Skeleton className="h-40" />;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-1 text-2xl font-bold">{type.title}</h1>
        <p className="mb-4 text-muted-foreground">
          {formatDuration(type.durationMinutes)} · {WORK_HOURS_LABEL}
        </p>
        <div className="rounded-xl border p-2">
          <Calendar
            mode="single"
            month={today}
            defaultMonth={today}
            selected={day ?? undefined}
            onSelect={(d) => d && loadSlots(d)}
            startMonth={today}
            endMonth={lastDay}
            disabled={(d) => d < today || d > lastDay}
            locale={{ code: 'ru-RU' }}
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Информация</CardTitle>
          <CardDescription>
            {day ? formatDateTimeMsk(day.toISOString()) : 'Дата не выбрана'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h2 className="mb-2 text-sm font-semibold">Статус слотов</h2>
          {day === null && <p className="text-sm text-muted-foreground">Выберите дату в календаре</p>}
          {day !== null && slots === null && <Skeleton className="h-24" />}
          {day !== null && slots !== null && slots.length === 0 && (
            <p className="text-sm text-muted-foreground">Нет слотов на этот день</p>
          )}
          {day !== null && slots !== null && slots.length > 0 && (
            <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto">
              {slots.map((s) => (
                <Button
                  key={s.start}
                  variant={selected?.start === s.start ? 'default' : 'outline'}
                  disabled={s.status === 'booked'}
                  onClick={() => setSelected(s)}
                >
                  {formatTimeMsk(s.start)}
                  {s.status === 'booked' ? (
                    <Badge variant="secondary" className="ml-1">
                      Занято
                    </Badge>
                  ) : null}
                </Button>
              ))}
            </div>
          )}
          {loadError && day !== null && <p className="mt-2 text-sm text-destructive">{loadError}</p>}
          <Button
            className="mt-4 w-full"
            disabled={selected === null}
            onClick={() =>
              typeId &&
              selected &&
              navigate(`/book/${typeId}/confirm?start=${encodeURIComponent(selected.start)}`)
            }
          >
            Продолжить
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
