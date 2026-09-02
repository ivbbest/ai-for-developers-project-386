import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FEATURES = [
  {
    title: 'Фиксированные 30-минутные слоты',
    text: 'Ежедневно с 09:00 до 18:00 (МСК) — выберите удобное время за пару кликов.',
  },
  {
    title: 'Проверка конфликта',
    text: 'Система не даст занять уже забронированное время — пересечения исключены.',
  },
  {
    title: 'Предстоящие события',
    text: 'Вся лента будущих встреч — в админке, без переписки и звонков.',
  },
];

export function HomePage() {
  return (
    <div>
      <section className="py-10 text-center">
        <h1 className="text-3xl font-bold">БЫСТРАЯ ЗАПИСЬ НА ЗВОНОК</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Выберите тип встречи, дату и свободный слот — гость получит подтверждение сразу.
        </p>
        <Button className="mt-6" size="lg" asChild>
          <Link to="/book">Записаться</Link>
        </Button>
      </section>
      <section className="grid gap-4 py-10 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <CardTitle className="text-base">{f.title}</CardTitle>
              <CardDescription>{f.text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
