import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../errors.js';
import { InvalidDateError } from '../repositories/bookings.js';
import { OutOfWindowError, ValidationError } from '../services/slots.js';

// Единый JSON-хендлер ошибок (C7, E18–E19): любой сбой на /api/* отдаётся
// моделью Error {code,message}, а не дефолтным HTML Express. Ставится
// ПОСЛЕ всех маршрутов; необработанные исключения логируются на сервере,
// наружу уходит нейтральное сообщение (не протекают стеки/внутренности).

function send(res: Response, status: number, code: string, message: string): void {
  res.status(status).json({ code, message });
}

export function apiErrorHandler(err: unknown, _req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) return next(err);

  if (err instanceof HttpError) {
    return send(res, err.status, err.code, err.message);
  }
  if (err instanceof ZodError) {
    // E8/E9/E10/E11/E12: первое сообщение zod — человекочитаемое, RU-подсказка сверху
    const first = err.issues[0];
    const field = first?.path.join('.') ?? 'тело';
    return send(res, 400, 'validation', `Поле «${field}»: ${first?.message ?? 'некорректно'}`);
  }
  if (err instanceof InvalidDateError) {
    return send(res, 400, 'validation', err.message);
  }
  if (err instanceof OutOfWindowError) {
    return send(res, 400, 'slot_out_of_window', err.message); // E5
  }
  if (err instanceof ValidationError) {
    return send(res, 400, 'validation', err.message); // E4/E7/E12
  }

  const type = (err as { type?: string })?.type;
  if (type === 'entity.too.large') {
    return send(res, 413, 'payload_too_large', 'Тело запроса слишком большое'); // E9/E18
  }
  if (type === 'entity.parse.failed') {
    return send(res, 400, 'validation', 'Ожидался валидный JSON'); // E9
  }

  console.error('Unhandled error:', err);
  return send(res, 500, 'server_error', 'Внутренняя ошибка сервера'); // E19 (5xx)
}
