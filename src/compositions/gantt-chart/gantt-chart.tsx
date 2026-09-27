import React, { useId, useState } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./gantt-chart.module.css";

export const ganttChartVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "compact",
  },
});

export const ganttMilestoneSchedulerVariants = ganttChartVariants;
export type GanttChartVariantProps = VariantProps<typeof ganttChartVariants>;

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

export interface GanttMilestoneSchedulerProps
  extends React.HTMLAttributes<HTMLElement>,
    GanttChartVariantProps {
  projectTitle?: string;
  projectCode?: string;
  timeframeLabel?: string; // "Q4 2026 Sprint Runway"
  totalDays?: number; // default 30
  tasks: GanttTask[];
  onTaskSelect?: (taskId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export type GanttChartProps = GanttMilestoneSchedulerProps;

/**
 * GanttMilestoneScheduler / GanttChart visualizes project schedules, critical paths, and milestone deadlines.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and strict logical CSS.
 *
 * @maturity stable
 */
export const GanttMilestoneScheduler = React.forwardRef<HTMLElement, GanttMilestoneSchedulerProps>(
  function GanttMilestoneScheduler(
    {
      projectTitle = "Project Hyperion: Autonomous Flight Software Migration",
      projectCode = "PRJ-HYP-801",
      timeframeLabel = "October 2026 (30-Day Milestone Sprint)",
      totalDays = 30,
      tasks,
      onTaskSelect,
      density = "compact",
      className = "",
      ...rest
    },
    ref
  ) {
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
        ref={ref}
        data-slot="gantt-chart"
        data-density={density}
        className={`${ganttChartVariants({ density })}${className ? ` ${className}` : ""}`.trim()}
        aria-labelledby={headingId}
        {...rest}
      >
        {/* Header */}
        <header className={styles.header} data-slot="gantt-chart-header">
          <div className={styles.titleGroup} data-slot="gantt-chart-title-group">
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
          <div className={styles.controlsBar} data-slot="gantt-chart-controls">
            <button
              type="button"
              className={`${styles.filterBtn} ${criticalOnly ? styles.filterActive : ""}`}
              data-slot="gantt-chart-filter-btn"
              onClick={() => setCriticalOnly(!criticalOnly)}
              aria-pressed={criticalOnly}
            >
              {criticalOnly ? "Showing Critical Path Only" : "Show All Tasks"}
            </button>
          </div>
        </header>

        {/* Main Split Layout: Left WBS / Right Gantt Timeline */}
        <div className={styles.ganttGrid} data-slot="gantt-chart-grid">
          {/* Left Side: Work Breakdown Table */}
          <div className={styles.wbsPane} data-slot="gantt-chart-wbs-pane">
            <table className={styles.wbsTable} data-slot="gantt-chart-wbs-table" aria-label="Task work breakdown structure">
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
                      data-slot="gantt-chart-wbs-row"
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
          <div className={styles.timelinePane} data-slot="gantt-chart-timeline-pane" aria-label="Gantt timeline bars">
            {/* Day column scale */}
            <div className={styles.scaleHeader} data-slot="gantt-chart-scale-header">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className={styles.scaleCol}>
                  Day {idx * 3 + 1}
                </div>
              ))}
            </div>

            {/* Task bars representation */}
            <div className={styles.barsContainer} data-slot="gantt-chart-bars">
              {displayedTasks.map((task) => {
                const leftPercent = Math.min((task.startDayOffset / totalDays) * 100, 100);
                const widthPercent = Math.min((task.durationDays / totalDays) * 100, 100 - leftPercent);
                const isSelected = activeTaskId === task.id;

                return (
                  <div key={task.id} className={styles.barRow} data-slot="gantt-chart-bar-row">
                    {task.isMilestone ? (
                      <div
                        className={`${styles.milestoneMarker} ${isSelected ? styles.markerSelected : ""}`}
                        data-slot="gantt-chart-milestone-marker"
                        style={{ insetInlineStart: `${leftPercent}%` }}
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
                        data-slot="gantt-chart-bar"
                        style={{
                          insetInlineStart: `${leftPercent}%`,
                          inlineSize: `${Math.max(widthPercent, 4)}%`,
                        }}
                        title={`${task.name}: ${task.progressPercent}% complete`}
                      >
                        <div
                          className={styles.barProgress}
                          style={{ inlineSize: `${task.progressPercent}%` }}
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
  }
);

GanttMilestoneScheduler.displayName = "GanttMilestoneScheduler";

export const GanttChart = GanttMilestoneScheduler;
