/** Locale-aware number formatting for UI display. */
export function formatNumber(
  value: number,
  locale = "en-US",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/** Formats a 0–1 ratio (or 0–100 when `isRatio` is false) as a percentage. */
export function formatPercent(
  value: number,
  fractionDigits = 1,
  isRatio = true
): string {
  const pct = isRatio ? value * 100 : value;
  return `${pct.toFixed(fractionDigits)}%`;
}

/** Truncates a string with an ellipsis beyond `maxLength` characters. */
export function truncate(text: string, maxLength: number): string {
  return text.length <= maxLength
    ? text
    : `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

/** Minor decimal unit mapping per ISO 4217 */
const CURRENCY_DECIMALS: Record<string, number> = {
  JPY: 0,
  KRW: 0,
  VND: 0,
  CLP: 0,
  BHD: 3,
  KWD: 3,
  OMR: 3,
  TND: 3,
};

export interface FormatCurrencyOptions {
  currency?: string;
  locale?: string;
  accountingFormat?: boolean; // Formats -$1,200.00 as ($1,200.00)
  displaySymbol?: "symbol" | "narrowSymbol" | "code" | "name";
}

/**
 * Top-tier enterprise currency formatter with ISO 4217 decimal precision
 * and accounting negative-parentheses display.
 */
export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "USD",
    locale = "en-US",
    accountingFormat = false,
    displaySymbol = "symbol",
  } = options;

  const decimals =
    CURRENCY_DECIMALS[currency.toUpperCase()] !== undefined
      ? CURRENCY_DECIMALS[currency.toUpperCase()]
      : 2;

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: displaySymbol,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absAmount);

  if (isNegative) {
    if (accountingFormat) {
      return `(${formatted})`;
    }
    return `-${formatted}`;
  }

  return formatted;
}

/** Formats compact metrics (e.g. 1.2M, 450K, 2.5B). */
export function formatCompactNumber(
  value: number,
  locale = "en-US",
  fractionDigits = 1
): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Formats Indian numbering system (Lakhs and Crores e.g. 12,34,567.89). */
export function formatIndianNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Enterprise date and calendar formatter supporting Gregorian, Hijri, and Buddhist calendars.
 */
export function formatEnterpriseDate(
  date: Date | string | number,
  locale = "en-US",
  calendar: "gregory" | "islamic-umalqura" | "buddhist" = "gregory"
): string {
  const d = typeof date === "object" ? date : new Date(date);
  return new Intl.DateTimeFormat(`${locale}-u-ca-${calendar}`, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}
