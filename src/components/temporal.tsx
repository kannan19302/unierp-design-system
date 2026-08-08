"use client";

import { useState, type FC } from "react";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

// ── TimePicker ────────────────────────────────────────
export interface TimePickerProps {
  value?: string; // HH:mm
  onChange?: (time: string) => void;
  disabled?: boolean;
}

export const TimePicker: FC<TimePickerProps> = ({ value = "09:00", onChange, disabled }) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-2)" }}>
      <Clock size={16} style={{ color: "var(--color-text-muted)" }} />
      <input
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          padding: "var(--space-2) var(--space-3)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text)",
        }}
      />
    </div>
  );
};

// ── DateTimePicker ────────────────────────────────────
export interface DateTimePickerProps {
  value?: string; // YYYY-MM-DDTHH:mm
  onChange?: (datetime: string) => void;
  disabled?: boolean;
}

export const DateTimePicker: FC<DateTimePickerProps> = ({ value, onChange, disabled }) => {
  return (
    <input
      type="datetime-local"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        padding: "var(--space-2) var(--space-3)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-bg)",
        fontSize: "var(--text-sm)",
        color: "var(--color-text)",
      }}
    />
  );
};

// ── Calendar ──────────────────────────────────────────
export interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
}

export const Calendar: FC<CalendarProps> = ({ selectedDate = new Date(), onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  return (
    <div
      style={{
        width: "280px",
        padding: "var(--space-3)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-bg-elevated)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
        <button onClick={prevMonth} aria-label="Previous month" style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontWeight: 600, fontSize: "var(--text-sm)" }}>{monthName} {year}</span>
        <button onClick={nextMonth} aria-label="Next month" style={{ background: "none", border: "none", cursor: "pointer" }}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--space-1)", textAlign: "center", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)" }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--space-1)" }}>
        {days.map((dateObj, idx) => {
          if (!dateObj) return <div key={idx} />;
          const isSelected = selectedDate.toDateString() === dateObj.toDateString();
          return (
            <button
              key={idx}
              onClick={() => onSelectDate?.(dateObj)}
              style={{
                height: "32px",
                border: "none",
                borderRadius: "var(--radius-md)",
                background: isSelected ? "var(--color-primary)" : "transparent",
                color: isSelected ? "#ffffff" : "var(--color-text)",
                cursor: "pointer",
                fontSize: "var(--text-xs)",
              }}
            >
              {dateObj.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Scheduler ─────────────────────────────────────────
export interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
}

export interface SchedulerProps {
  events: EventItem[];
}

export const Scheduler: FC<SchedulerProps> = ({ events }) => {
  return (
    <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-4)" }}>
      <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: "var(--space-3)" }}>Schedule Overview</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {events.map((ev) => (
          <div
            key={ev.id}
            style={{
              padding: "var(--space-2) var(--space-3)",
              background: "var(--color-bg-sunken)",
              borderLeft: "3px solid var(--color-primary)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              fontSize: "var(--text-xs)",
            }}
          >
            <span style={{ fontWeight: 600 }}>{ev.title}</span>
            <span style={{ color: "var(--color-text-muted)" }}>{ev.start} - {ev.end}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── FiscalPeriodPicker ────────────────────────────────
// B06: Fiscal periods respect a tenant's configured calendar.
//   fiscalYearStartMonth: 1=Jan (calendar year), 4=Apr (UK fiscal), 7=Jul, 10=Oct, etc.

export interface FiscalPeriod {
  label: string;   // e.g. "Q1 (Apr–Jun FY2026)"
  value: string;   // machine key, e.g. "FY2026-Q1"
  startDate: Date;
  endDate: Date;
}

export interface FiscalPeriodPickerProps {
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
  fiscalYear?: number;
  /** Month the fiscal year starts (1 = January). Default 1 = calendar year. */
  fiscalYearStartMonth?: number;
}

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
];

function buildFiscalPeriods(fiscalYear: number, startMonth: number): FiscalPeriod[] {
  // startMonth is 1-indexed (1=Jan)
  const sm = startMonth - 1; // 0-indexed
  const periods: FiscalPeriod[] = [];
  for (let q = 0; q < 4; q++) {
    const qStartMonth = (sm + q * 3) % 12;
    const qEndMonth = (sm + q * 3 + 2) % 12;
    // The calendar year for the start of this quarter
    const calYearOffset = Math.floor((sm + q * 3) / 12);
    const startYear = fiscalYear - (startMonth > 1 ? 1 : 0) + calYearOffset;
    const endYear = fiscalYear - (startMonth > 1 ? 1 : 0) + Math.floor((sm + q * 3 + 2) / 12);
    const startDate = new Date(startYear, qStartMonth, 1);
    const endDate = new Date(endYear, qEndMonth + 1, 0); // last day of end month

    periods.push({
      label: `Q${q + 1} (${MONTH_NAMES[qStartMonth]}–${MONTH_NAMES[qEndMonth]} FY${fiscalYear})`,
      value: `FY${fiscalYear}-Q${q + 1}`,
      startDate,
      endDate,
    });
  }
  return periods;
}

export const FiscalPeriodPicker: FC<FiscalPeriodPickerProps> = ({
  selectedPeriod,
  onSelectPeriod,
  fiscalYear = new Date().getFullYear(),
  fiscalYearStartMonth = 1,
}) => {
  const periods = buildFiscalPeriods(fiscalYear, fiscalYearStartMonth);
  const currentValue = selectedPeriod ?? (periods[0]?.value || "");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)" }}>
        FY{fiscalYear}:
      </span>
      <select
        value={currentValue}
        onChange={(e) => onSelectPeriod?.(e.target.value)}
        aria-label="Fiscal period"
        style={{
          padding: "var(--space-1-5) var(--space-3)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg)",
          fontSize: "var(--text-sm)",
        }}
      >
        {periods.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ── useTimezoneDate — timezone-correct date utility ───
// B06: A date entered in Asia/Kolkata denotes the same instant in America/New_York.
//
// Usage:
//   const { format, toUtcIso } = useTimezoneDate("Asia/Kolkata");
//   const displayString = format(utcDate);   // shown in Kolkata time
//   const utcIso = toUtcIso("2024-01-15T10:30"); // parses as Kolkata, returns UTC ISO

export interface TimezoneUtils {
  /** Format a UTC Date (or ISO string) as a human-readable string in the given timezone. */
  format: (date: Date | string, opts?: Intl.DateTimeFormatOptions) => string;
  /** Parse a local datetime string (YYYY-MM-DDTHH:mm) as if it's in the given timezone
   *  and return the equivalent UTC ISO-8601 string. */
  toUtcIso: (localDatetime: string) => string;
  /** The IANA timezone ID this hook was initialised with. */
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
    // Parse the local datetime string (no Z suffix) as if it's in the given timezone.
    // We use Intl to find the offset at that local time.
    const [datePart = "1970-01-01", timePart = "00:00"] = localDatetime.split("T");
    const [year = 1970, month = 1, day = 1] = datePart.split("-").map(Number);
    const [hour = 0, minute = 0] = timePart.split(":").map(Number);

    // Create a UTC date and measure the difference via Intl
    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));

    // Format the UTC guess in the target timezone to measure offset
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

