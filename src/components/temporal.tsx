"use client";

import { useState, type FC, type ReactNode } from "react";
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
export interface FiscalPeriodPickerProps {
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
  fiscalYear?: number;
}

export const FiscalPeriodPicker: FC<FiscalPeriodPickerProps> = ({
  selectedPeriod = "Q1",
  onSelectPeriod,
  fiscalYear = new Date().getFullYear(),
}) => {
  const periods = ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)" }}>FY{fiscalYear}:</span>
      <select
        value={selectedPeriod}
        onChange={(e) => onSelectPeriod?.(e.target.value)}
        style={{
          padding: "var(--space-1-5) var(--space-3)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-bg)",
          fontSize: "var(--text-sm)",
        }}
      >
        {periods.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  );
};
