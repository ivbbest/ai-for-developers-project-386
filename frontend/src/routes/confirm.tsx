import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { ApiError, type Booking } from '../api/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatDateTimeMsk } from '../lib/time';

export function ConfirmPage() {
  const { typeId } = useParams<{ typeId: string }>();
  const [params] = useSearchParams();
  const start = params.get('start');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);

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
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Подтверждение записи</CardTitle>
        <CardDescription>{formatDateTimeMsk(start)}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submit}>
          <label className="grid gap-1 text-sm">
            Имя
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required />
          </label>
          <label className="grid gap-1 text-sm">
            Email
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="grid gap-1 text-sm">
            Заметки (необязательно)
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} />
          </label>
          {error && (
            <p className="text-sm text-destructive">
              {error}
              {conflict && (
                <Link className="ml-2 underline" to={`/book/${typeId}`}>
                  Обновить слоты
                </Link>
              )}
            </p>
          )}
          <Button type="submit" disabled={submitting || !name.trim()}>
            {submitting ? 'Отправка…' : 'Подтвердить запись'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
