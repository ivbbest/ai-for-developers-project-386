import { z } from 'zod';

// Валидация входа по контракту (E8: .strict() — неизвестные поля = 400;
// E10: trim, пустые после trim — 400; E11: email — простая regex-проверка,
// регистр сохраняется). Сообщения — RU: они уходят клиенту в Error.message.

const ID_PATTERN = /^[a-z0-9-]{1,40}$/;
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const bookingCreateSchema = z
  .object({
    eventTypeId: z.string('Ожидается строка'),
    // формат/сетка — после проверки типа (E6: «тип раньше валидации start»)
    start: z.string('Ожидается строка'),
    name: z.string('Ожидается строка').trim().min(1, 'нельзя пусто').max(120, 'максимум 120 символов'),
    email: z
      .string('Ожидается строка')
      .trim()
      .min(1, 'нельзя пусто')
      .max(254, 'слишком длинный')
      .regex(EMAIL_PATTERN, { error: 'некорректный адрес' }),
    notes: z.string('Ожидается строка').trim().min(1, 'пустые заметки не нужны').max(2000, 'максимум 2000 символов').optional(),
  })
  .strict();

export const eventTypeCreateSchema = z
  .object({
    id: z.string('Ожидается строка').regex(ID_PATTERN, 'только строчные a-z, цифры, дефис; 1–40 символов'),
    title: z.string('Ожидается строка').trim().min(1, 'нельзя пусто').max(80, 'максимум 80 символов'),
    description: z.string('Ожидается строка').trim().max(500, 'максимум 500 символов').optional(),
    durationMinutes: z
      .number('Ожидается число')
      .int('целое число')
      .min(5, 'от 5 минут')
      .max(540, 'до 540 минут')
      .refine((v) => v % 5 === 0, { error: 'кратно 5 минут' }),
  })
  .strict();
