"use client";

import { type FC, type ReactNode, type KeyboardEvent } from "react";
import { Check, Clock, AlertCircle, Ban, ArrowRight } from "lucide-react";
import styles from "./stage-progression-bar.module.css";

export type StageStatus = "completed" | "current" | "upcoming" | "blocked" | "exception";
export type StageDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface StageItem {
  id: string;
  label: string;
  status: StageStatus;
  duration?: string;
  subtext?: string;
  disabled?: boolean;
}

export interface StageProgressionBarProps {
  /** Ordered list of process stages */
  stages: StageItem[];
  /** Identifier of the actively focused / current stage */
  currentStageId?: string;
  /** Callback when user clicks or activates a stage with keyboard */
  onStageClick?: (stage: StageItem) => void;
  /** Primary stage advance button action */
  onAdvanceStage?: () => void;
  /** Custom label for the advance button (e.g., "Mark as Approved") */
  advanceButtonLabel?: string;
  /** Whether to show the fast-forward / advance button */
  showAdvanceButton?: boolean;
  /** Right-slot extra action buttons */
  actions?: ReactNode;
  /** Density scale */
  density?: StageDensity;
  /** Accessible label */
  ariaLabel?: string;
  className?: string;
}

export const StageProgressionBar: FC<StageProgressionBarProps> = ({
  stages,
  currentStageId,
  onStageClick,
  onAdvanceStage,
  advanceButtonLabel = "Advance Stage",
  showAdvanceButton = false,
  actions,
  density = "compact",
  ariaLabel = "Business Process Stage Progression",
  className = "",
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, stage: StageItem) => {
    if (stage.disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onStageClick?.(stage);
    }
  };

  return (
    <nav
      className={`${styles.root} ${className}`.trim()}
      data-density={density}
      aria-label={ariaLabel}
    >
      <ol className={styles.stageList} role="list">
        {stages.map((stage, idx) => {
          const isCurrent = stage.id === currentStageId || stage.status === "current";
          const isCompleted = stage.status === "completed";
          const isBlocked = stage.status === "blocked";
          const isException = stage.status === "exception";
          const isClickable = !stage.disabled && !!onStageClick;

          let statusClass = styles.statusUpcoming;
          if (isCompleted) statusClass = styles.statusCompleted;
          else if (isCurrent) statusClass = styles.statusCurrent;
          else if (isBlocked) statusClass = styles.statusBlocked;
          else if (isException) statusClass = styles.statusException;

          return (
            <li
              key={stage.id}
              className={`${styles.stageItem} ${statusClass}`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <button
                type="button"
                className={`${styles.stageBtn} ${isClickable ? styles.stageClickable : ""}`}
                onClick={() => isClickable && onStageClick?.(stage)}
                onKeyDown={(e) => handleKeyDown(e, stage)}
                disabled={stage.disabled}
                tabIndex={isClickable ? 0 : -1}
                aria-label={`Step ${idx + 1}: ${stage.label}, status: ${stage.status}${
                  stage.duration ? `, ${stage.duration}` : ""
                }`}
              >
                <div className={styles.stageContent}>
                  <div className={styles.stageIndicator}>
                    {isCompleted ? (
                      <Check size={12} className={styles.iconCheck} aria-hidden="true" />
                    ) : isBlocked ? (
                      <Ban size={12} className={styles.iconBlocked} aria-hidden="true" />
                    ) : isException ? (
                      <AlertCircle size={12} className={styles.iconException} aria-hidden="true" />
                    ) : (
                      <span className={styles.stepNumber}>{idx + 1}</span>
                    )}
                  </div>

                  <div className={styles.labelCol}>
                    <span className={styles.stageLabel}>{stage.label}</span>
                    {(stage.duration || stage.subtext) && (
                      <span className={styles.stageDuration}>
                        {stage.duration && (
                          <Clock size={10} className={styles.clockIcon} aria-hidden="true" />
                        )}
                        <span>{stage.duration ?? stage.subtext}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.chevronArrow} aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ol>

      {(showAdvanceButton || actions) && (
        <div className={styles.actionSlot}>
          {actions}
          {showAdvanceButton && onAdvanceStage && (
            <button
              type="button"
              className={styles.advanceBtn}
              onClick={onAdvanceStage}
            >
              <span>{advanceButtonLabel}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </nav>
  );
};
