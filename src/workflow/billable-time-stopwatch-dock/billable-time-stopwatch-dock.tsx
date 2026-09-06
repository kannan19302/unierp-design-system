import React, { useId, useState, useEffect } from "react";
import styles from "./billable-time-stopwatch-dock.module.css";

export interface BillableMatterOption {
  id: string;
  clientName: string; // "Stripe Global"
  matterCode: string; // "MAT-2026-904"
  matterTitle: string; // "Commercial Series D Financing"
  defaultHourlyRate: number; // 650
}

export interface BillableTimeStopwatchDockProps {
  matters: BillableMatterOption[];
  initialMatterId?: string;
  onCommitTimeEntry?: (entry: {
    matterId: string;
    secondsElapsed: number;
    hourlyRate: number;
    isBillable: boolean;
    description: string;
  }) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const BillableTimeStopwatchDock: React.FC<BillableTimeStopwatchDockProps> = ({
  matters,
  initialMatterId,
  onCommitTimeEntry,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const descId = useId();
  const matterSelectId = useId();
  const [selectedMatterId, setSelectedMatterId] = useState<string>(
    initialMatterId ?? (matters[0]?.id ?? "")
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [isBillable, setIsBillable] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const activeMatter = matters.find((m) => m.id === selectedMatterId) ?? matters[0] ?? null;
  const currentRate = activeMatter ? activeMatter.defaultHourlyRate : 0;
  const earnedAmount = isBillable ? (seconds / 3600) * currentRate : 0;

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (seconds === 0 || !activeMatter) return;

    onCommitTimeEntry?.({
      matterId: activeMatter.id,
      secondsElapsed: seconds,
      hourlyRate: currentRate,
      isBillable,
      description,
    });

    setIsRunning(false);
    setSeconds(0);
    setDescription("");
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.dockBadge}>STOPWATCH TIME CAPTURE</span>
          <span className={`${styles.statusPill} ${isRunning ? styles.pillRunning : styles.pillStopped}`}>
            {isRunning ? "● RECORDING" : "○ STOPPED"}
          </span>
        </div>
        <h2 id={headingId} className={styles.title}>
          Legal & Professional Services Billable Time Dock
        </h2>
      </header>

      <form onSubmit={handleCommit} className={styles.dockBody}>
        <div className={styles.timerDisplay}>
          <span className={styles.ticker}>{formatTime(seconds)}</span>
          <div className={styles.rateSummary}>
            <span className={styles.earnedText}>
              ${earnedAmount.toFixed(2)} {isBillable ? "Billable" : "(Non-Billable)"}
            </span>
            <span className={styles.rateSub}>@ ${currentRate}/hr</span>
          </div>
        </div>

        <div className={styles.controlsRow}>
          <button
            type="button"
            className={`${styles.playBtn} ${isRunning ? styles.btnPause : styles.btnStart}`}
            onClick={() => setIsRunning(!isRunning)}
            aria-label={isRunning ? "Pause time capture" : "Start time capture"}
          >
            {isRunning ? "Pause" : "Start Timer"}
          </button>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => {
              setIsRunning(false);
              setSeconds(0);
            }}
            disabled={seconds === 0}
            aria-label="Reset stopwatch to zero"
          >
            Reset
          </button>
          <label className={styles.billableToggle}>
            <input
              type="checkbox"
              checked={isBillable}
              onChange={(e) => setIsBillable(e.target.checked)}
              className={styles.checkboxInput}
            />
            <span className={styles.toggleLabel}>Billable Time</span>
          </label>
        </div>

        <div className={styles.inputsGrid}>
          <div className={styles.formGroup}>
            <label htmlFor={matterSelectId} className={styles.inputLabel}>
              Client & Matter Account:
            </label>
            <select
              id={matterSelectId}
              className={styles.select}
              value={selectedMatterId}
              onChange={(e) => setSelectedMatterId(e.target.value)}
            >
              {matters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.clientName} — {m.matterCode}: {m.matterTitle} (${m.defaultHourlyRate}/hr)
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={descId} className={styles.inputLabel}>
              Work Description / Activity Log:
            </label>
            <input
              id={descId}
              type="text"
              className={styles.input}
              placeholder="e.g., Drafting Section 4.2 Indemnity Covenant and Closing Checklist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.footerRow}>
          <button
            type="submit"
            className={styles.commitBtn}
            disabled={seconds === 0}
            aria-label="Commit time entry to billable ledger"
          >
            Log Time Entry ({formatTime(seconds)})
          </button>
        </div>
      </form>
    </section>
  );
};
