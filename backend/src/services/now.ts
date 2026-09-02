// Единственный источник текущего времени (план 3.1): env NOW (ISO-строка)
// фиксирует «сейчас» для тестов и e2e, иначе — системные часы.
// Сервисы принимают nowFn-параметр (инъекция) — unit-тесты не трогают env.
export function now(): Date {
  const fixed = process.env.NOW;
  if (fixed === undefined || fixed === '') return new Date();
  const d = new Date(fixed);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`NOW должен быть валидной ISO-датой, получено: ${fixed}`);
  }
  return d;
}

export type NowFn = () => Date;
