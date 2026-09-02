import { Link, useLocation } from 'react-router-dom';
import type { Booking } from '../api/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTimeMsk } from '../lib/time';

export function SuccessPage() {
  const { state } = useLocation() as { state?: { booking?: Booking } };
  const booking = state?.booking;

  return (
    <Card className="mx-auto max-w-md text-center">
      <CardHeader>
        <CardTitle>Бронь подтверждена. До встречи!</CardTitle>
        {booking ? (
          <CardDescription>{formatDateTimeMsk(booking.start)}</CardDescription>
        ) : (
          <CardDescription>Ваша запись создана</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex justify-center gap-2">
        <Button variant="outline" asChild>
          <Link to="/">На главную</Link>
        </Button>
        <Button asChild>
          <Link to="/admin">Предстоящие встречи</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
