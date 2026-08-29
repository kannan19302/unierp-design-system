"use client";

import { useState, type FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./calendar.module.css";

export interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  className?: string;
}

export const Calendar: FC<CalendarProps> = ({
  selectedDate = new Date(),
  onSelectDate,
  className = "",
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

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

  const weekHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={`${styles.calendar} ${className}`.trim()} role="region" aria-label="Calendar">
      <div className={styles.header}>
        <button
          type="button"
          onClick={prevMonth}
          aria-label="Previous month"
          className={styles.navButton}
        >
          <ChevronLeft size={16} />
        </button>
        <span className={styles.monthLabel}>
          {monthName} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          aria-label="Next month"
          className={styles.navButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.grid}>
        {weekHeaders.map((h) => (
          <span key={h} className={styles.dayHeader}>
            {h}
          </span>
        ))}
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} />;
          }
          const isSelected =
            selectedDate &&
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelectDate?.(date)}
              className={`${styles.dayCell} ${isSelected ? styles.dayCellSelected : ""}`}
              aria-label={date.toDateString()}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
