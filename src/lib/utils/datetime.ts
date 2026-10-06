import dayjs from "dayjs";

/**
 * Normalize a datetime string from the API (ISO 8601, e.g. "2026-10-22T03:00:00.000Z")
 * for use in datetime-local inputs: convert to the browser's local timezone
 * and format as YYYY-MM-DDTHH:mm.
 */
export function normalizeDateTimeInput(value?: string | null): string {
  if (!value) return "";
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format("YYYY-MM-DDTHH:mm") : "";
}

/**
 * Convert a datetime-local value (YYYY-MM-DDTHH:mm) to an ISO string that
 * carries the browser's UTC offset (e.g. "2026-10-22T10:00:00+07:00"), so the
 * backend parses the intended instant regardless of the server's timezone.
 */
export function toIsoWithLocalOffset(value?: string | null): string | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format() : null;
}
