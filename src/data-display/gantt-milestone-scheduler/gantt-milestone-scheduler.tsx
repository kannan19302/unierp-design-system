import React, { useId, useState } from "react";
import styles from "./gantt-milestone-scheduler.module.css";

export interface GanttTask {
  id: string;
  name: string;
  assignee: string;
  startDate: string; // "2026-10-01"
  endDate: string; // "2026-10-15"
  startDayOffset: number; // 0 to 30
  durationDays: number; // 1 to 30
  progressPercent: number; // 0 to 100
  isMilestone?: boolean;
  isCriticalPath?: boolean;
  predecessorId?: string;
}

export interface GanttMilestoneSchedulerProps {
  projectTitle?: string;
  projectCode?: string;
  timeframeLabel?: string; // "Q4 2026 Sprint Runway"
  totalDays?: number; // default 30
  tasks: GanttTask[];
  onTaskSelect?: (taskId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const GanttMilestoneScheduler: React.FC<GanttMilestoneSchedulerProps> = ({
  projectTitle = "Project Hyperion: Autonomous Flight Software Migration",
  projectCode = "PRJ-HYP-801",
  timeframeLabel = "October 2026 (30-Day Milestone Sprint)",
  totalDays = 30,
  tasks,
  onTaskSelect,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [criticalOnly, setCriticalOnly] = useState<boolean>(false);

  const displayedTasks = criticalOnly
    ? tasks.filter((t) => t.isCriticalPath)
    : tasks;

  const handleTaskClick = (taskId: string) => {
    setActiveTaskId(taskId);
    onTaskSelect?.(taskId);
  };

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
            📊
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.projectCode}>{projectCode}</span>
              <span className={styles.timeframe}>{timeframeLabel}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              {projectTitle}
            </h2>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controlsBar}>
          <button
            type="button"
            className={`${styles.filterBtn} ${criticalOnly ? styles.filterActive : ""}`}
            onClick={() => setCriticalOnly(!criticalOnly)}
            aria-pressed={criticalOnly}
          >
            {criticalOnly ? "Showing Critical Path Only" : "Show All Tasks"}
          </button>
        </div>
      </header>

      {/* Main Split Layout: Left WBS / Right Gantt Timeline */}
      <div className={styles.ganttGrid}>
        {/* Left Side: Work Breakdown Table */}
        <div className={styles.wbsPane}>
          <table className={styles.wbsTable} aria-label="Task work breakdown structure">
            <thead>
              <tr>
                <th scope="col" className={styles.wbsTaskTh}>Task / Deliverable</th>
                <th scope="col" className={styles.wbsAssigneeTh}>Owner</th>
                <th scope="col" className={styles.wbsDatesTh}>Span</th>
                <th scope="col" className={styles.wbsPctTh}>%</th>
              </tr>
            </thead>
            <tbody>
              {displayedTasks.map((task) => {
                const isSelected = activeTaskId === task.id;
                return (
                  <tr
                    key={task.id}
                    className={`${styles.wbsRow} ${isSelected ? styles.rowSelected : ""} ${
                      task.isCriticalPath ? styles.rowCritical : ""
                    }`}
                    onClick={() => handleTaskClick(task.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleTaskClick(task.id);
                      }
                    }}
                    role="button"
                    aria-label={`Select task: ${task.name}`}
                  >
                    <td className={styles.wbsTaskCell}>
                      <div className={styles.taskTitleWrap}>
                        {task.isMilestone && <span className={styles.diamondIcon} aria-hidden="true">◆</span>}
                        <span className={styles.taskName}>{task.name}</span>
                      </div>
                    </td>
                    <td className={styles.wbsAssigneeCell}>{task.assignee}</td>
                    <td className={styles.wbsDatesCell}>
                      {task.startDate} → {task.endDate}
                    </td>
                    <td className={styles.wbsPctCell}>{task.progressPercent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Side: Timeline Visualization */}
        <div className={styles.timelinePane} aria-label="Gantt timeline bars">
          {/* Day column scale */}
          <div className={styles.scaleHeader}>
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className={styles.scaleCol}>
                Day {idx * 3 + 1}
              </div>
            ))}
          </div>

          {/* Task bars representation */}
          <div className={styles.barsContainer}>
            {displayedTasks.map((task) => {
              const leftPercent = Math.min((task.startDayOffset / totalDays) * 100, 100);
              const widthPercent = Math.min((task.durationDays / totalDays) * 100, 100 - leftPercent);
              const isSelected = activeTaskId === task.id;

              return (
                <div key={task.id} className={styles.barRow}>
                  {task.isMilestone ? (
                    <div
                      className={`${styles.milestoneMarker} ${isSelected ? styles.markerSelected : ""}`}
                      style={{ left: `${leftPercent}%` }}
                      title={`${task.name} (Milestone)`}
                      aria-label={`${task.name} milestone at day ${task.startDayOffset}`}
                    >
                      ◆
                    </div>
                  ) : (
                    <div
                      className={`${styles.ganttBar} ${
                        task.isCriticalPath ? styles.barCritical : styles.barStandard
                      } ${isSelected ? styles.barSelected : ""}`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${Math.max(widthPercent, 4)}%`,
                      }}
                      title={`${task.name}: ${task.progressPercent}% complete`}
                    >
                      <div
                        className={styles.barProgress}
                        style={{ width: `${task.progressPercent}%` }}
                      />
                      <span className={styles.barLabel}>{task.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
