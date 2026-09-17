import { ZodError } from 'zod';

export type FieldErrors = Record<string, string>;

export function mapZodFieldErrors(error: ZodError): FieldErrors {
  return error.issues.reduce<FieldErrors>((errors, issue) => {
    const field = String(issue.path[0] || 'form');
    if (!errors[field]) {
      errors[field] = issue.message;
    }
    return errors;
  }, {});
}

export function invalidInputClass(hasError: boolean) {
  return hasError ? 'border-red-500 focus:ring-red-500' : '';
}

export function focusFirstInvalidField() {
  requestAnimationFrame(() => {
    const firstInvalid = document.querySelector<HTMLElement>('[aria-invalid="true"]');
    firstInvalid?.focus();
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

export function validateRequiredFields(
  fields: Record<string, string>,
  labels: Record<string, string>,
): FieldErrors {
  const errors: FieldErrors = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!value?.trim()) {
      errors[key] = `${labels[key] || key} is required`;
    }
  }
  return errors;
}

export function clearFieldError(
  previous: FieldErrors,
  field: string,
): FieldErrors {
  if (!previous[field]) return previous;
  const { [field]: _, ...remaining } = previous;
  return remaining;
}
