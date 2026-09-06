import React, { useId, useState, useMemo } from "react";
import styles from "./multi-calendar-availability-scheduler.module.css";

export type ResourceType = "person" | "room" | "equipment";

export interface CalendarResource {
  id: string;
  name: string; // "Elena Rostova"
  role: string; // "Principal Architect"
  type: ResourceType;
  avatarColor?: string;
}

export interface ScheduledBooking {
  id: string;
  resourceId: string;
  title: string; // "Q3 Architecture Review"
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  isConflict?: boolean;
}

export interface MultiCalendarAvailabilitySchedulerProps {
  selectedDate: string; // "2026-09-15"
  resources: CalendarResource[];
  bookings: ScheduledBooking[];
  timeSlots?: string[]; // default ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
  timeZone?: string; // "America/New_York (UTC-4)"
  onSelectSlot?: (resourceId: string, time: string) => void;
  onBookingClick?: (booking: ScheduledBooking) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const defaultHours = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export const MultiCalendarAvailabilityScheduler: React.FC<
  MultiCalendarAvailabilitySchedulerProps
> = ({
  selectedDate,
  resources,
  bookings,
  timeSlots = defaultHours,
  timeZone = "America/New_York (UTC-4)",
  onSelectSlot,
  onBookingClick,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [activeTimeZone, setActiveTimeZone] = useState(timeZone);
  const [enabledResources, setEnabledResources] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    resources.forEach((r) => {
      init[r.id] = true;
    });
    return init;
  });

  const visibleResources = useMemo(() => {
    return resources.filter((r) => enabledResources[r.id] !== false);
  }, [resources, enabledResources]);

  const toggleResource = (id: string) => {
    setEnabledResources((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Find booking that starts at slot or overlaps
  const getBookingForSlot = (resourceId: string, time: string) => {
    return bookings.find((b) => b.resourceId === resourceId && b.startTime === time);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.badge}>RESOURCE AVAILABILITY SCHEDULER</span>
          <h2 id={headingId} className={styles.title}>
            Multi-Resource Schedule Matrix: {selectedDate}
          </h2>
        </div>

        <div className={styles.tzControls}>
          <label htmlFor="scheduler-tz-select" className={styles.tzLabel}>
            Timezone:
          </label>
          <select
            id="scheduler-tz-select"
            className={styles.tzSelect}
            value={activeTimeZone}
            onChange={(e) => setActiveTimeZone(e.target.value)}
          >
            <option value="America/New_York (UTC-4)">America/New_York (UTC-4)</option>
            <option value="America/Los_Angeles (UTC-7)">America/Los_Angeles (UTC-7)</option>
            <option value="Europe/London (UTC+1)">Europe/London (UTC+1)</option>
            <option value="Asia/Tokyo (UTC+9)">Asia/Tokyo (UTC+9)</option>
          </select>
        </div>
      </header>

      {/* Resource Filter Pills */}
      <div className={styles.filterPillsRow} aria-label="Toggle Resource Calendars">
        <span className={styles.filterPillsLabel}>Active Calendars:</span>
        <div className={styles.pillList}>
          {resources.map((res) => {
            const isChecked = enabledResources[res.id] !== false;
            return (
              <label key={res.id} className={`${styles.pillLabel} ${isChecked ? styles.pillActive : ""}`}>
                <input
                  type="checkbox"
                  className={styles.srOnly}
                  checked={isChecked}
                  onChange={() => toggleResource(res.id)}
                />
                <span className={styles.pillCheckmark}>{isChecked ? "✓" : "+"}</span>
                <span className={styles.pillName}>{res.name}</span>
                <span className={styles.pillType}>({res.type})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Timetable Grid */}
      <div className={styles.gridWrapper}>
        <table className={styles.gridTable} aria-label="Daily Resource Availability Timetable">
          <caption className={styles.srOnly}>
            Matrix of time slots versus team members, rooms, and physical resources
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.timeHeaderCol}>Time</th>
              {visibleResources.map((res) => (
                <th key={res.id} scope="col" className={styles.resourceHeaderCol}>
                  <div className={styles.resourceName}>{res.name}</div>
                  <div className={styles.resourceRole}>{res.role}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time} className={styles.timeRow}>
                <th scope="row" className={styles.timeCell}>
                  {time}
                </th>
                {visibleResources.map((res) => {
                  const booking = getBookingForSlot(res.id, time);

                  if (booking) {
                    return (
                      <td key={res.id} className={styles.slotCell}>
                        <button
                          type="button"
                          className={`${styles.bookingCard} ${
                            booking.isConflict ? styles.bookingConflict : styles.bookingNormal
                          }`}
                          onClick={() => onBookingClick?.(booking)}
                          aria-label={`Reserved: ${booking.title} from ${booking.startTime} to ${booking.endTime} for ${res.name}`}
                        >
                          <span className={styles.bookingTime}>
                            {booking.startTime} - {booking.endTime}
                          </span>
                          <strong className={styles.bookingTitle}>{booking.title}</strong>
                          {booking.isConflict && (
                            <span className={styles.conflictBadge}>⚠️ Double Booked</span>
                          )}
                        </button>
                      </td>
                    );
                  }

                  return (
                    <td key={res.id} className={styles.slotCell}>
                      <button
                        type="button"
                        className={styles.emptySlotBtn}
                        onClick={() => onSelectSlot?.(res.id, time)}
                        aria-label={`Available slot at ${time} for ${res.name}. Click to reserve.`}
                      >
                        <span className={styles.emptyPlus}>+</span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
