const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

const SHORT_MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

function toDate(value: Date | string): Date {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${String(value)}`);
  }

  return date;
}

function monthAt<T>(months: readonly T[], index: number): T {
  const month = months[index];

  if (month === undefined) {
    throw new Error(`Invalid month index: ${index}`);
  }

  return month;
}

export function formatDate(value: Date | string): string {
  const date = toDate(value);
  return `${date.getUTCDate()} ${monthAt(MONTHS, date.getUTCMonth())} ${date.getUTCFullYear()}`;
}

export function formatDateShort(value: Date | string): string {
  const date = toDate(value);
  return `${date.getUTCDate()} ${monthAt(SHORT_MONTHS, date.getUTCMonth())} ${date.getUTCFullYear()}`;
}

export function formatMonthYear(value: Date | string): string {
  const date = toDate(value);
  return `${monthAt(SHORT_MONTHS, date.getUTCMonth())} ${date.getUTCFullYear()}`;
}

export function formatDateRange(start: Date | string, end?: Date | string): string {
  const from = formatMonthYear(start);
  return end ? `${from} — ${formatMonthYear(end)}` : `${from} — presente`;
}

export function toIsoDate(value: Date | string): string {
  return toDate(value).toISOString().slice(0, 10);
}
