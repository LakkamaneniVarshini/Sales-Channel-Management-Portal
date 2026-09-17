import { z } from 'zod';

export function asString(value: unknown): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

export function asNumber(value: unknown, fallback = 0): number {
  if (value === undefined || value === null || value === '') return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

export function requiredString(message: string) {
  return z.preprocess(asString, z.string().min(1, message));
}

export function requiredNumber(message: string, min = 1) {
  return z.preprocess((value) => asNumber(value, 0), z.number().min(min, message));
}
