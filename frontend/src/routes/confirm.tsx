import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { ApiError, type Booking, type EventType, type Slot } from '../api/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDayLongMsk, formatTimeMsk, mskDay } from '../lib/time';

export function ConfirmPage() {
  const { typeId } = useParams<{ typeId: string }>();
  const [params] = useSearchParams();
  const rawStart = params.get('start');
  // ?start= правят руками — Invalid Date улетает в Intl/toISOString белым экраном
  const start = rawStart && !Number.isNaN(Date.parse(rawStart)) ? rawStart : null;
  const navigate = useNavigate();
  const dayParam = start ? mskDay(start) : null;

  const [type, setType] = useState<EventType | null>(null);
  const [daySlots, setDaySlots] = useState<Slot[] | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (!typeId || !start) return;
    api.listEventTypes().then((list) => setType(list.find((t) => t.id === typeId) ?? null)).catch(() => {});
    // счётчик «Свободно» — как в референсе; сетку дня перезапрашиваем — она же
    // источник актуальности после 409
    api.getSlots(typeId, mskDay(start)).then(setDaySlots).catch(() => setDaySlots([]));
  }, [typeId, start]);

  if (!typeId || !start) {
    return (
      <div>
        <p className="text-destructive">Слот не выбран</p>
        <Button asChild className="mt-4">
          <Link to="/book">Выбрать тип</Link>
        </Button>
      </div>
    );
  }

  const freeCount = daySlots?.filter((s) => s.status === 'available').length;
  const endIso = type
    ? new Date(new Date(start).getTime() + type.durationMinutes * 60_000).toISOString()
    : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    setConflict(false);
    try {
      const booking: Booking = await api.createBooking({
        eventTypeId: typeId,
        start,
        name: name.trim(),
        email: email.trim(),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      navigate(`/book/${typeId}/success`, { state: { booking } });
    } catch (err) {
      if (err instanceof ApiError && err.code === 'slot_conflict') {
        setConflict(true);
        setError(err.message || 'Слот уже занят');
        // рефреш сетки: слот мог занять другой гость
        api.getSlots(typeId, mskDay(start)).then(setDaySlots).catch(() => {});
      } else if (err instanceof ApiError) {
        setError(err.message || 'Проверьте данные формы');
      } else {
        setError('Сервер недоступен, попробуйте ещё раз');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Запись на звонок</h1>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <InfoBox label="Выбранная дата" value={formatDayLongMsk(start)} />
            <InfoBox label="Выбранное время" value={endIso ? `${formatTimeMsk(start)} - ${formatTimeMsk(endIso)}` : '…'} />
            <InfoBox label="Свободно" value={freeCount === undefined ? '…' : String(freeCount)} />
            <InfoBox label="Длительности в дне" value={type ? `${type.durationMinutes} мин` : '…'} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Подтверждение записи</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to={`/book/${typeId}?date=${dayParam}`}>Изменить</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={submit}>
              <Input
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                placeholder="Заметки (необязательно)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={2000}
              />
              {error && (
                <p className="text-sm text-destructive">
                  {error}
                  {conflict && (
                    <Link className="ml-2 underline" to={`/book/${typeId}?date=${dayParam}`}>
                      Обновить слоты
                    </Link>
                  )}
                </p>
              )}
              <Button type="submit" disabled={submitting || !name.trim()} className="w-full">
                {submitting ? 'Отправка…' : 'Подтвердить запись'}
              </Button>
            </form>
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
