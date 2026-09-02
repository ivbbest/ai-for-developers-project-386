import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { EventType } from '../api/types';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDuration } from '../lib/duration';

export function BookTypePage() {
  const [types, setTypes] = useState<EventType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listEventTypes()
      .then(setTypes)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'не удалось загрузить каталог'));
  }, []);

  if (error) return <p className="text-destructive">{error}</p>;
  if (types === null) return <p>Загрузка…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Выберите тип события</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {types.map((t) => (
          <Link key={t.id} to={`/book/${t.id}`}>
            <Card className="transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                {t.description ? <CardDescription>{t.description}</CardDescription> : null}
                <CardDescription>{formatDuration(t.durationMinutes)}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
