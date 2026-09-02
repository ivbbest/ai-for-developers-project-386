// Доменные типы — по docs/specs/api-contract.md «Доменные сущности».
// Время храним и отдаём в UTC (ISO-строки); TZ сервиса — только для сетки/окна.

export interface EventType {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
}

export type SlotStatus = 'available' | 'booked';

export interface Slot {
  start: string; // ISO UTC
  end: string;   // ISO UTC
  status: SlotStatus;
}

export interface Booking {
  id: string; // uuid
  eventTypeId: string;
  start: string; // ISO UTC
  end: string;   // ISO UTC
  name: string;
  email: string;
  notes?: string;
  createdAt: string; // ISO UTC
}

export interface BookingInput {
  eventTypeId: string;
  start: string;
  name: string;
  email: string;
  notes?: string;
}
