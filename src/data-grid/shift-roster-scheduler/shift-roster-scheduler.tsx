import React, { useId, useState } from "react";
import styles from "./shift-roster-scheduler.module.css";

export interface ScheduledShift {
  id: string;
  dayIndex: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
  startTime: string; // "08:00"
  endTime: string; // "16:30"
  hours: number; // 8.5
  role: string; // "Head Chef", "Line Cook", "Bartender", "Host"
  status?: "scheduled" | "confirmed" | "swap_requested";
}

export interface EmployeeRosterEntry {
  employeeId: string;
  fullName: string;
  roleTitle: string;
  hourlyRate: number; // e.g. $24.50
  maxWeeklyHours?: number; // 40
  shifts: ScheduledShift[];
}

export interface ShiftRosterSchedulerProps {
  rosterWeekLabel?: string; // "Sep 07 - Sep 13, 2026"
  departmentName?: string; // "Culinary & Kitchen Operations"
  laborBudget?: number; // e.g. $14,000
  employees: EmployeeRosterEntry[];
  onAssignShift?: (employeeId: string, dayIndex: number) => void;
  onRemoveShift?: (employeeId: string, shiftId: string) => void;
  onPublishRoster?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const ShiftRosterScheduler: React.FC<ShiftRosterSchedulerProps> = ({
  rosterWeekLabel = "Sep 07 - Sep 13, 2026",
  departmentName = "Culinary & Kitchen Operations",
  laborBudget = 14500,
  employees,
  onAssignShift,
  onRemoveShift,
  onPublishRoster,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [published, setPublished] = useState<boolean>(false);

  // Compute total hours & labor costs
  const calculateEmployeeStats = (emp: EmployeeRosterEntry) => {
    const totalHours = emp.shifts.reduce((acc, s) => acc + s.hours, 0);
    const regularHours = Math.min(40, totalHours);
    const overtimeHours = Math.max(0, totalHours - 40);
    // 1.5x overtime multiplier
    const totalCost =
      regularHours * emp.hourlyRate + overtimeHours * emp.hourlyRate * 1.5;
    return { totalHours, overtimeHours, totalCost };
  };

  const totalScheduledHours = employees.reduce((acc, emp) => {
    return acc + emp.shifts.reduce((sAcc, s) => sAcc + s.hours, 0);
  }, 0);

  const totalScheduledCost = employees.reduce((acc, emp) => {
    return acc + calculateEmployeeStats(emp).totalCost;
  }, 0);

  const budgetVariance = laborBudget - totalScheduledCost;

  const handlePublish = () => {
    setPublished(true);
    onPublishRoster?.();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            📅
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.weekBadge}>{rosterWeekLabel}</span>
              <span className={styles.deptBadge}>{departmentName}</span>
              {published && (
                <span className={styles.publishedBadge}>● Roster Published</span>
              )}
            </div>
            <h2 id={headingId} className={styles.title}>
              Weekly Shift Roster &amp; Labor Budget Tracker
            </h2>
          </div>
        </div>

        {/* Publish Action */}
        <div className={styles.headerActions}>
          <button
            type="button"
            className={`${styles.publishBtn} ${published ? styles.publishedBtn : ""}`}
            onClick={handlePublish}
          >
            {published ? "✓ Roster Active" : "🚀 Publish Shift Roster"}
          </button>
        </div>
      </header>

      {/* Labor Budget Ribbon */}
      <div className={styles.laborRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Total Scheduled Hours</span>
          <span className={styles.ribbonValue}>{totalScheduledHours.toFixed(1)} hrs</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Scheduled Labor Cost</span>
          <span className={styles.ribbonValue}>{formatCurrency(totalScheduledCost)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Department Labor Budget</span>
          <span className={styles.ribbonValue}>{formatCurrency(laborBudget)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Budget Variance</span>
          <span
            className={`${styles.ribbonValue} ${
              budgetVariance >= 0 ? styles.variancePositive : styles.varianceNegative
            }`}
          >
            {budgetVariance >= 0 ? `+${formatCurrency(budgetVariance)} Under` : `-${formatCurrency(Math.abs(budgetVariance))} Over`}
          </span>
        </div>
      </div>

      {/* Shift Roster Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Weekly shift scheduling roster for {departmentName}
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thStaff}>Staff Member</th>
              {DAYS_OF_WEEK.map((d) => (
                <th key={d} scope="col" className={styles.thDay}>
                  {d}
                </th>
              ))}

              <th scope="col" className={styles.thSummary}>Total Hrs</th>
              <th scope="col" className={styles.thSummary}>Est. Cost</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const { totalHours, overtimeHours, totalCost } = calculateEmployeeStats(emp);
              return (
                <tr key={emp.employeeId} className={styles.tableRow}>
                  {/* Staff Info Cell */}
                  <td className={styles.staffCell}>
                    <div className={styles.staffName}>{emp.fullName}</div>
                    <div className={styles.staffRole}>
                      {emp.roleTitle} (${emp.hourlyRate}/h)
                    </div>
                  </td>

                  {/* 7 Days of the Week */}
                  {DAYS_OF_WEEK.map((_, dayIdx) => {
                    const shift = emp.shifts.find((s) => s.dayIndex === dayIdx);
                    return (
                      <td key={dayIdx} className={styles.dayCell}>
                        {shift ? (
                          <div className={styles.shiftCard}>
                            <span className={styles.shiftTimes}>
                              {shift.startTime} - {shift.endTime}
                            </span>
                            <div className={styles.shiftMeta}>
                              <span className={styles.shiftHours}>
                                {shift.hours}h
                              </span>
                              {onRemoveShift && (
                                <button
                                  type="button"
                                  className={styles.removeShiftBtn}
                                  onClick={() =>
                                    onRemoveShift(emp.employeeId, shift.id)
                                  }
                                  aria-label={`Remove shift for ${emp.fullName} on ${DAYS_OF_WEEK[dayIdx]}`}
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className={styles.emptyCell}>
                            {onAssignShift && (
                              <button
                                type="button"
                                className={styles.addShiftBtn}
                                onClick={() =>
                                  onAssignShift(emp.employeeId, dayIdx)
                                }
                                aria-label={`Assign shift to ${emp.fullName} on ${DAYS_OF_WEEK[dayIdx]}`}
                              >
                                + Shift
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Total Hours Cell */}
                  <td className={styles.summaryCell}>
                    <strong>{totalHours.toFixed(1)}h</strong>
                    {overtimeHours > 0 && (
                      <span className={styles.otBadge}>
                        +{overtimeHours.toFixed(1)}h OT
                      </span>
                    )}
                  </td>

                  {/* Est Cost Cell */}
                  <td className={styles.costCell}>
                    {formatCurrency(totalCost)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
