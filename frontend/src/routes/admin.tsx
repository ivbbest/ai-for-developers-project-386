import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Booking } from '../api/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDateTimeMsk } from '../lib/time';

export function AdminPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listBookings()
      .then(setBookings)
      .catch(() => setError('Не удалось загрузить встречи'));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Предстоящие события</h1>
        <Button asChild variant="outline">
          <Link to="/admin/new-type">Новый тип события</Link>
        </Button>
      </div>
      {error && <p className="text-destructive">{error}</p>}
      {bookings === null && !error && <Skeleton className="h-40" />}
      {bookings !== null && bookings.length === 0 && (
        <p className="text-muted-foreground">Пока нет запланированных встреч</p>
      )}
      {bookings !== null && bookings.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гость</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Слот (МСК)</TableHead>
              <TableHead>Создана</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.email}</TableCell>
                <TableCell>{formatDateTimeMsk(b.start)}</TableCell>
                <TableCell>{formatDateTimeMsk(b.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
