/**
 * Normalize a datetime string for use in datetime-local inputs.
 * Trims to 16 characters (YYYY-MM-DDTHH:mm) if longer.
 */
export function normalizeDateTimeInput(value?: string | null): string {
  if (!value) return "";
  return value.length >= 16 ? value.slice(0, 16) : value;
}
