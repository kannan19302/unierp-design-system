"use client";

import {
  useState,
  useMemo,
  type FC,
} from "react";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import styles from "./period-close-cockpit.module.css";

export type CloseTaskStatus = "completed" | "in-progress" | "blocked" | "pending";
export type CockpitDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface CloseTask {
  id: string;
  title: string;
  category: "Subledger AP/AR" | "Assets & Inventory" | "Reconciliation & Tax" | "Consolidation & GL";
  owner: string;
  dueDate: string;
  status: CloseTaskStatus;
  prerequisiteTaskIds?: string[];
  exceptionCount?: number;
  actionLabel?: string;
}

export interface PeriodCloseCockpitProps {
  /** Fiscal period label (e.g. FY2026-Q3 September Close) */
  fiscalPeriod: string;
  /** List of period close tasks */
  tasks: CloseTask[];
  /** Whether the period general ledger is hard-locked */
  isHardLocked?: boolean;
  /** Callback when hard lock trigger is executed */
  onExecuteHardLock?: () => void;
  /** Callback to change task status */
  onTaskStatusChange?: (taskId: string, newStatus: CloseTaskStatus) => void;
  /** Callback when clicking drill-down action for a task */
  onTaskAction?: (task: CloseTask) => void;
  /** Density scale */
  density?: CockpitDensity;
  className?: string;
}

/**
 * `<PeriodCloseCockpit>` — Financial period close orchestration & lock checklist.
 * Benchmarked against Workday Financials (#33), SAP S/4HANA Finance (#5, #12), and NetSuite (#30).
 */
export const PeriodCloseCockpit: FC<PeriodCloseCockpitProps> = ({
  fiscalPeriod,
  tasks,
  isHardLocked = false,
  onExecuteHardLock,
  onTaskStatusChange,
  onTaskAction,
  density = "compact",
  className = "",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === "completed").length,
    [tasks]
  );
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const canHardLock = completedCount === totalTasks && !isHardLocked;

  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.category));
    return ["All", ...Array.from(set)];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (selectedCategory === "All") return tasks;
    return tasks.filter((t) => t.category === selectedCategory);
  }, [tasks, selectedCategory]);

  const isPrerequisiteMet = (task: CloseTask) => {
    if (!task.prerequisiteTaskIds || task.prerequisiteTaskIds.length === 0) return true;
    return task.prerequisiteTaskIds.every((prereqId) => {
      const p = tasks.find((t) => t.id === prereqId);
      return p && p.status === "completed";
    });
  };

  const getEffectiveStatus = (task: CloseTask): CloseTaskStatus => {
    if (task.status === "completed") return "completed";
    if (!isPrerequisiteMet(task)) return "blocked";
    return task.status;
  };

  const renderStatusBadge = (status: CloseTaskStatus) => {
    switch (status) {
      case "completed":
        return (
          <span className={`${styles.statusBadge} ${styles.statusCompleted}`}>
            <CheckCircle2 size={12} aria-hidden="true" />
            <span>Completed</span>
          </span>
        );
      case "in-progress":
        return (
          <span className={`${styles.statusBadge} ${styles.statusProgress}`}>
            <Clock size={12} aria-hidden="true" />
            <span>In Progress</span>
          </span>
        );
      case "blocked":
        return (
          <span className={`${styles.statusBadge} ${styles.statusBlocked}`}>
            <AlertTriangle size={12} aria-hidden="true" />
            <span>Prerequisite Blocked</span>
          </span>
        );
      default:
        return (
          <span className={`${styles.statusBadge} ${styles.statusPending}`}>
            <span>Pending</span>
          </span>
        );
    }
  };

  return (
    <div
      className={`${styles.container} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Period Close Cockpit"
    >
      {/* ── Cockpit Header ── */}
      <div className={styles.header}>
        <div className={styles.headerTitleRow}>
          <div className={styles.periodInfo}>
            <Calendar size={16} className={styles.calendarIcon} aria-hidden="true" />
            <h2 className={styles.periodTitle}>{fiscalPeriod}</h2>
            <span
              className={`${styles.lockBadge} ${
                isHardLocked ? styles.badgeHardLocked : styles.badgeUnlocked
              }`}
            >
              {isHardLocked ? (
                <>
                  <Lock size={12} aria-hidden="true" />
                  <span>General Ledger Hard-Locked</span>
                </>
              ) : (
                <>
                  <Unlock size={12} aria-hidden="true" />
                  <span>Close In Progress</span>
                </>
              )}
            </span>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.hardLockBtn}
              onClick={onExecuteHardLock}
              disabled={!canHardLock || isHardLocked}
              title={
                canHardLock
                  ? "Authorize final GL hard lock"
                  : "All closing checklist tasks must be completed before locking"
              }
            >
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Finalize & Hard Lock GL</span>
            </button>
          </div>
        </div>

        {/* Progress Bar Ribbon */}
        <div className={styles.progressRow}>
          <div className={styles.progressTrack} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Closing checklist completion progress">
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {completedCount} of {totalTasks} Tasks Complete ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div className={styles.filterBar}>
        <div className={styles.categoryTabs}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.catBtn} ${selectedCategory === cat ? styles.catBtnActive : ""}`}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tasks Checklist Table ── */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Task Description</th>
              <th scope="col">Category</th>
              <th scope="col">Assigned Owner</th>
              <th scope="col">Due Date</th>
              <th scope="col">Status</th>
              <th scope="col" className={styles.actionCol}>Drilldown</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => {
              const effectiveStatus = getEffectiveStatus(task);
              const isBlocked = effectiveStatus === "blocked";

              return (
                <tr
                  key={task.id}
                  className={`${styles.row} ${task.status === "completed" ? styles.rowDone : ""}`}
                >
                  <td className={styles.titleCell}>
                    <div className={styles.titleGroup}>
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        disabled={isBlocked || isHardLocked}
                        onChange={(e) => {
                          onTaskStatusChange?.(
                            task.id,
                            e.target.checked ? "completed" : "in-progress"
                          );
                        }}
                        aria-label={`Mark task ${task.title} as completed`}
                      />
                      <span className={styles.taskTitle}>{task.title}</span>
                      {task.exceptionCount && task.exceptionCount > 0 ? (
                        <span className={styles.exceptionPill}>
                          {task.exceptionCount} exceptions
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className={styles.categoryCell}>
                    <span className={styles.categoryTag}>{task.category}</span>
                  </td>
                  <td className={styles.ownerCell}>{task.owner}</td>
                  <td className={styles.dateCell}>{task.dueDate}</td>
                  <td className={styles.statusCell}>
                    {renderStatusBadge(effectiveStatus)}
                  </td>
                  <td className={styles.actionCol}>
                    {onTaskAction && (
                      <button
                        type="button"
                        className={styles.drilldownBtn}
                        onClick={() => onTaskAction(task)}
                        title={`Open ${task.title} workspace`}
                        aria-label={`Open ${task.title} workspace`}
                      >
                        <span>{task.actionLabel || "Inspect"}</span>
                        <ArrowRight size={12} aria-hidden="true" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
