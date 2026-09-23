"use client";

import { forwardRef, type HTMLAttributes, type ReactNode, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "../../utils/cn";
import styles from "./scheduler.module.css";

export type SchedulerDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export type SchedulerEventCategory = "default" | "primary" | "success" | "warning" | "danger";

export interface SchedulerEvent {
  id: string;
  title: string;
  startHour: number; // 0-23
  endHour?: number;
  category?: SchedulerEventCategory;
  subtitle?: string;
}

export interface SchedulerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  date?: Date;
  events?: SchedulerEvent[];
  startHour?: number;
  endHour?: number;
  onAddEvent?: (hour: number) => void;
  onEventClick?: (event: SchedulerEvent) => void;
  onDateChange?: (newDate: Date) => void;
  density?: SchedulerDensity;
  className?: string;
  title?: ReactNode;
}

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL Scheduler primitive — hourly timeline calendar view for shift management and task scheduling.
 */
export const Scheduler = forwardRef<HTMLDivElement, SchedulerProps>(({
  date = new Date(),
  events = [],
  startHour = 8,
  endHour = 19,
  onAddEvent,
  onEventClick,
  onDateChange,
  density = "standard",
  className = "",
  title,
  ...props
}, ref) => {
  const hoursCount = Math.max(endHour - startHour + 1, 1);
  const hours = Array.from({ length: hoursCount }, (_, i) => i + startHour);

  const handlePrevDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    onDateChange?.(prev);
  };

  const handleNextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    onDateChange?.(next);
  };

  const handleKeyDown = (e: KeyboardEvent, hour: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onAddEvent?.(hour);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(styles.scheduler, className)}
      data-density={density}
      role="region"
      aria-label="Schedule View"
      {...props}
    >
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <CalendarIcon size={16} className={styles.calIcon} aria-hidden="true" />
          <h4 className={styles.title}>
            {title ?? `Schedule for ${date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}`}
          </h4>
        </div>

        {onDateChange && (
          <div className={styles.navControls}>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handlePrevDay}
              aria-label="Previous day"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              className={styles.navBtn}
              onClick={handleNextDay}
              aria-label="Next day"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.timeline} role="grid" aria-label="Hourly timeline">
        {hours.map((hour) => {
          const hourEvents = events.filter((e) => e.startHour === hour);
          const timeString = `${String(hour).padStart(2, "0")}:00`;

          return (
            <div
              key={hour}
              className={styles.hourRow}
              tabIndex={onAddEvent ? 0 : undefined}
              role="row"
              aria-label={`Time slot ${timeString}`}
              onClick={() => onAddEvent?.(hour)}
              onKeyDown={(e) => handleKeyDown(e, hour)}
            >
              <div className={styles.hourLabel} role="rowheader">
                <Clock size={11} className={styles.clockIcon} aria-hidden="true" />
                <span>{timeString}</span>
              </div>
              <div className={styles.hourContent} role="gridcell">
                {hourEvents.map((evt) => {
                  const categoryClass = evt.category ? styles[evt.category] : "";
                  return (
                    <button
                      key={evt.id}
                      type="button"
                      className={cn(styles.eventCard, categoryClass)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(evt);
                      }}
                      aria-label={`${evt.title}${evt.subtitle ? `, ${evt.subtitle}` : ""}`}
                    >
                      <span className={styles.eventTitle}>{evt.title}</span>
                      {evt.subtitle && <span className={styles.eventSubtitle}>{evt.subtitle}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

Scheduler.displayName = "Scheduler";
