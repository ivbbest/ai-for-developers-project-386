import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { EventType } from '../api/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OwnerBlock } from '../components/owner-block';

export function BookTypePage() {
  const [types, setTypes] = useState<EventType[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listEventTypes()
      .then(setTypes)
      .catch(() => setError('Не удалось загрузить каталог'));
  }, []);

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <OwnerBlock />
          <h1 className="mt-4 text-3xl font-bold">Выберите тип события</h1>
          <CardDescription className="mt-1">
            Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот.
          </CardDescription>
        </CardContent>
      </Card>
      {error && <p className="text-destructive">{error}</p>}
      {types === null && !error && <Skeleton className="h-32" />}
      <div className="grid gap-4 sm:grid-cols-2">
        {types?.map((t) => (
          <Link key={t.id} to={`/book/${t.id}`}>
            <Card className="h-full transition-colors hover:border-primary/60">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {t.durationMinutes} мин
                  </Badge>
                </div>
                {t.description ? <CardDescription>{t.description}</CardDescription> : null}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
