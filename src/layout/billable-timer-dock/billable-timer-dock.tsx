"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type FC,
  type ChangeEvent,
} from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import styles from "./billable-timer-dock.module.css";

export type TimerDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface MatterOrProject {
  id: string;
  name: string;
  code: string;
  clientName: string;
  hourlyRate: number;
}

export interface BillableTimeEntry {
  id: string;
  projectId: string;
  projectName: string;
  durationSeconds: number;
  formattedDuration: string;
  isBillable: boolean;
  rateMultiplier: number;
  hourlyRate: number;
  accruedAmount: number;
  notes: string;
  timestamp: string;
}

export interface BillableTimerDockProps {
  /** Available projects, matters, or customer accounts */
  projects: MatterOrProject[];
  /** Default selected project ID */
  defaultProjectId?: string;
  /** Callback when user commits/logs the tracked time */
  onLogTime?: (entry: BillableTimeEntry) => void;
  /** Initial minimized state */
  initialMinimized?: boolean;
  /** Currency symbol */
  currency?: string;
  /** Density scale */
  density?: TimerDensity;
  className?: string;
}

/**
 * `<BillableTimerDock>` — Floating persistent time-tracking stopwatch dock.
 * Benchmarked against Clio Legal (#113), Linear (#66), and Asana (#71).
 */
export const BillableTimerDock: FC<BillableTimerDockProps> = ({
  projects,
  defaultProjectId,
  onLogTime,
  initialMinimized = false,
  currency = "$",
  density = "compact",
  className = "",
}) => {
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProjectId || projects[0]?.id || ""
  );
  const [isBillable, setIsBillable] = useState(true);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [notes, setNotes] = useState("");
  const [committedNotice, setCommittedNotice] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || projects[0],
    [projects, selectedProjectId]
  );

  const formattedTime = useMemo(() => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }, [seconds]);

  const accruedAmount = useMemo(() => {
    if (!isBillable || !activeProject) return 0;
    const hours = seconds / 3600;
    return hours * activeProject.hourlyRate * multiplier;
  }, [seconds, isBillable, activeProject, multiplier]);

  const handleToggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleCommitTime = () => {
    if (seconds === 0 || !activeProject) return;

    const entry: BillableTimeEntry = {
      id: `time-${Date.now()}`,
      projectId: activeProject.id,
      projectName: activeProject.name,
      durationSeconds: seconds,
      formattedDuration: formattedTime,
      isBillable,
      rateMultiplier: multiplier,
      hourlyRate: activeProject.hourlyRate,
      accruedAmount: Math.round(accruedAmount * 100) / 100,
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
    };

    onLogTime?.(entry);
    handleReset();
    setNotes("");
    setCommittedNotice(true);
    setTimeout(() => setCommittedNotice(false), 2500);
  };

  return (
    <div
      className={`${styles.dock} ${isMinimized ? styles.dockMinimized : ""} ${className}`.trim()}
      data-density={density}
      role="region"
      aria-label="Billable Time Tracker Dock"
    >
      {/* ── Dock Bar Header ── */}
      <div className={styles.dockHeader}>
        <div className={styles.headerLeft}>
          <div className={`${styles.statusDot} ${isRunning ? styles.dotRunning : ""}`} aria-hidden="true" />
          <Clock size={15} className={styles.clockIcon} aria-hidden="true" />
          <span className={styles.timerDisplay} aria-live="polite">
            {formattedTime}
          </span>
          {isBillable && accruedAmount > 0 && (
            <span className={styles.accruedBadge}>
              {currency}{accruedAmount.toFixed(2)}
            </span>
          )}
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            className={`${styles.playBtn} ${isRunning ? styles.pauseBtn : ""}`}
            onClick={handleToggleTimer}
            aria-label={isRunning ? "Pause timer" : "Start timer"}
            title={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
          </button>

          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
            disabled={seconds === 0}
            aria-label="Reset timer"
            title="Reset timer"
          >
            <RotateCcw size={12} aria-hidden="true" />
          </button>

          <button
            type="button"
            className={styles.collapseBtn}
            onClick={() => setIsMinimized((prev) => !prev)}
            aria-label={isMinimized ? "Expand timer dock" : "Minimize timer dock"}
            title={isMinimized ? "Expand timer dock" : "Minimize timer dock"}
          >
            {isMinimized ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* ── Expanded Content Form ── */}
      {!isMinimized && (
        <div className={styles.dockBody}>
          {committedNotice && (
            <div className={styles.noticeBar} role="status">
              <CheckCircle2 size={13} aria-hidden="true" />
              <span>Time logged to billing ledger successfully.</span>
            </div>
          )}

          <div className={styles.formRow}>
            <label htmlFor="timer-project-select" className={styles.fieldLabel}>
              <Briefcase size={12} aria-hidden="true" />
              <span>Matter / Project</span>
            </label>
            <select
              id="timer-project-select"
              className={styles.select}
              value={selectedProjectId}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name} ({p.clientName})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.billingOptionsRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isBillable}
                onChange={(e) => setIsBillable(e.target.checked)}
              />
              <span>Billable</span>
            </label>

            {isBillable && (
              <div className={styles.multiplierGroup}>
                <DollarSign size={12} className={styles.multIcon} aria-hidden="true" />
                <select
                  className={styles.multiplierSelect}
                  value={multiplier}
                  onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                  aria-label="Billing Rate Multiplier"
                >
                  <option value={1.0}>1.0x (Standard)</option>
                  <option value={1.5}>1.5x (Overtime)</option>
                  <option value={2.0}>2.0x (Holiday/Weekend)</option>
                </select>
              </div>
            )}
          </div>

          <div className={styles.formRow}>
            <input
              type="text"
              className={styles.notesInput}
              placeholder="What are you working on? (Audit note / timesheet description)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              aria-label="Timesheet description"
            />
          </div>

          <div className={styles.dockFooter}>
            <button
              type="button"
              className={styles.logTimeBtn}
              onClick={handleCommitTime}
              disabled={seconds === 0}
            >
              Log Time ({formattedTime})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
