"use client";

import { type FC, type ReactNode } from "react";
import styles from "./scheduler.module.css";

export interface SchedulerEvent {
  id: string;
  title: string;
  startHour: number; // 0-23
  endHour?: number;
}

export interface SchedulerProps {
  date?: Date;
  events?: SchedulerEvent[];
  onAddEvent?: (hour: number) => void;
  className?: string;
  title?: ReactNode;
}

export const Scheduler: FC<SchedulerProps> = ({
  date = new Date(),
  events = [],
  onAddEvent,
  className = "",
  title,
}) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

  return (
    <div className={`${styles.scheduler} ${className}`.trim()} role="region" aria-label="Schedule View">
      <div className={styles.header}>
        <h4 className={styles.title}>
          {title ?? `Schedule for ${date.toLocaleDateString()}`}
        </h4>
      </div>

      <div className={styles.timeline}>
        {hours.map((hour) => {
          const hourEvents = events.filter((e) => e.startHour === hour);
          const timeString = `${String(hour).padStart(2, "0")}:00`;

          return (
            <div
              key={hour}
              className={styles.hourRow}
              onClick={() => onAddEvent?.(hour)}
            >
              <div className={styles.hourLabel}>{timeString}</div>
              <div className={styles.hourContent}>
                {hourEvents.map((evt) => (
                  <div key={evt.id} className={styles.eventCard}>
                    {evt.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
