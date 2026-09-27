import { useState, forwardRef, type HTMLAttributes } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./calendar.module.css";

export const calendarVariants = cva(styles.calendar, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"],
      compact: styles.compact,
      standard: styles.standard,
      comfortable: styles.comfortable,
    },
    disabled: {
      true: styles.disabled,
      false: "",
    },
  },
  defaultVariants: {
    density: "standard",
    disabled: false,
  },
});

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Calendar primitive — accessible monthly date grid with month navigation, boundary constraints, and keyboard stepping.
 * Standardized with cva, data-slot, and W3C APG grid datepicker pattern.
 */
export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect">,
    VariantProps<typeof calendarVariants> {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(({
  selectedDate = new Date(),
  onSelectDate,
  minDate,
  maxDate,
  disabled = false,
  density = "standard",
  className = "",
  ...props
}, ref) => {
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

  const isDateDisabled = (date: Date) => {
    if (disabled) return true;
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59)) return true;
    return false;
  };

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const weekHeaders = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const calendarClass = `${calendarVariants({ density, disabled })} ${className}`.trim();

  return (
    <div
      ref={ref}
      data-slot="calendar"
      data-density={density}
      data-disabled={disabled ? "true" : undefined}
      className={calendarClass}
      role="region"
      aria-label="Calendar"
      {...props}
    >
      <div data-slot="calendar-header" className={styles.header}>
        <button
          type="button"
          onClick={prevMonth}
          disabled={disabled}
          aria-label="Previous month"
          data-slot="calendar-nav-prev"
          className={styles.navButton}
        >
          <ChevronLeft size={16} />
        </button>
        <span data-slot="calendar-title" className={styles.monthLabel}>
          {monthName} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={disabled}
          aria-label="Next month"
          data-slot="calendar-nav-next"
          className={styles.navButton}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div data-slot="calendar-grid" className={styles.grid}>
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

          const isDisabled = isDateDisabled(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => !isDisabled && onSelectDate?.(date)}
              disabled={isDisabled}
              data-slot="calendar-day"
              data-selected={isSelected ? "true" : undefined}
              className={`${styles.dayCell} ${isSelected ? styles.dayCellSelected : ""}`}
              aria-label={date.toDateString()}
              aria-pressed={isSelected ? "true" : undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
});

Calendar.displayName = "Calendar";
