import React from "react";
import styles from "./stage-path-navigator.module.css";

export type StagePathStatus = "completed" | "current" | "upcoming" | "rejected";

export interface StagePathStep {
  id: string;
  label: string;
  status: StagePathStatus;
  disabled?: boolean;
}

export interface StagePathNavigatorProps {
  stages: StagePathStep[];
  activeStageId?: string;
  selectedStageId?: string;
  onStageSelect?: (stageId: string) => void;
  actionLabel?: string;
  onActionClick?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const StagePathNavigator: React.FC<StagePathNavigatorProps> = ({
  stages,
  activeStageId,
  selectedStageId,
  onStageSelect,
  actionLabel = "Mark Stage as Complete",
  onActionClick,
  density = "standard",
  className = "",
  testId = "stage-path-navigator",
}) => {
  return (
    <nav
      className={`${styles.pathContainer} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label="Workflow Stage Progress"
    >
      <ol className={styles.stagesList}>
        {stages.map((stage) => {
          const isCurrent = stage.id === activeStageId || stage.status === "current";
          const isCompleted = stage.status === "completed";
          const isSelected = stage.id === selectedStageId;

          let statusClass = "";
          if (isCurrent) statusClass = styles.stageCurrent ?? "";
          else if (isCompleted) statusClass = styles.stageCompleted ?? "";

          return (
            <li key={stage.id} className={styles.stageItem}>
              <button
                type="button"
                className={`${styles.stageButton ?? ""} ${statusClass} ${isSelected ? (styles.stageSelected ?? "") : ""}`}
                onClick={() => onStageSelect?.(stage.id)}
                disabled={stage.disabled}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`${stage.label} (${stage.status})`}
              >
                {isCompleted && <span aria-hidden="true">✓ </span>}
                <span>{stage.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {actionLabel && onActionClick && (
        <button
          type="button"
          className={styles.stageActionBtn}
          onClick={onActionClick}
        >
          {actionLabel}
        </button>
      )}
    </nav>
  );
};
