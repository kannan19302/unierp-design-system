export interface TimezoneUtils {
  format: (date: Date | string, opts?: Intl.DateTimeFormatOptions) => string;
  toUtcIso: (localDatetime: string) => string;
  timezone: string;
}

export function useTimezoneDate(timezone: string): TimezoneUtils {
  const format = (date: Date | string, opts?: Intl.DateTimeFormatOptions): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      ...opts,
    }).format(d);
  };

  const toUtcIso = (localDatetime: string): string => {
    const [datePart = "1970-01-01", timePart = "00:00"] = localDatetime.split("T");
    const [year = 1970, month = 1, day = 1] = datePart.split("-").map(Number);
    const [hour = 0, minute = 0] = timePart.split(":").map(Number);

    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

    const localParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .format(utcGuess)
      .match(/(\d+)-(\d+)-(\d+),? (\d+):(\d+)/);

    if (!localParts) return utcGuess.toISOString();

    const [, ly = year, lm = month, ld = day, lh = hour, lmin = minute] = localParts.map(Number);
    const diffMs =
      Date.UTC(year, month - 1, day, hour, minute) -
      Date.UTC(ly, lm - 1, ld, lh, lmin);
    return new Date(utcGuess.getTime() + diffMs).toISOString();
  };

  return { format, toUtcIso, timezone };
}
