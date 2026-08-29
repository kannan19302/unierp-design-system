"use client";

import { type FC } from "react";
import { Check } from "lucide-react";
import styles from "./lifecycle-tracker.module.css";

export interface LifecycleStage {
  id: string;
  name: string;
  date?: string;
  description?: string;
}

export interface LifecycleTrackerProps {
  stages: LifecycleStage[];
  currentStageId: string;
  onSelectStage?: (stageId: string) => void;
  className?: string;
}

/**
 * `<LifecycleTracker>` — Enterprise Lifecycle & State Diagram Tracker.
 *
 * Visualizes the progression of business records across defined lifecycles
 * (e.g. `Draft → Submitted → Under Review → Approved → Closed`).
 */
export const LifecycleTracker: FC<LifecycleTrackerProps> = ({
  stages,
  currentStageId,
  onSelectStage,
  className,
}) => {
  const currentIdx = stages.findIndex((s) => s.id === currentStageId);

  return (
    <nav aria-label="Record Lifecycle" className={`${styles.container} ${className || ""}`}>
      {stages.map((stage, idx) => {
        const isCompleted = currentIdx !== -1 && idx < currentIdx;
        const isActive = stage.id === currentStageId;
        const isClickable = !!onSelectStage;
        const isLast = idx === stages.length - 1;

        const stageClass = [
          styles.stage,
          isActive ? styles.stage_active : "",
          isCompleted ? styles.stage_completed : "",
          isClickable ? styles.stage_clickable : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={stage.id} className={stageClass}>
            <div
              className={styles.stage_body}
              onClick={isClickable ? () => onSelectStage(stage.id) : undefined}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              aria-current={isActive ? "step" : undefined}
            >
              <div className={styles.stage_badge}>
                {isCompleted ? <Check size={13} /> : idx + 1}
              </div>
              <div className={styles.stage_info}>
                <span className={styles.stage_name}>{stage.name}</span>
                {stage.date && <span className={styles.stage_date}>{stage.date}</span>}
              </div>
            </div>
            {!isLast && <div className={styles.connector} />}
          </div>
        );
      })}
    </nav>
  );
};
