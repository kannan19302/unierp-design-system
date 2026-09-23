"use client";

import {
  forwardRef,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import styles from "./release-pipeline-stepper.module.css";

export type PipelineStageStatus =
  | "success"
  | "running"
  | "pending"
  | "failed"
  | "awaiting_approval";

export interface ReleaseStage {
  id: string;
  name: string;
  environment: string;
  status: PipelineStageStatus;
  version?: string;
  commitSha?: string;
  duration?: string;
  approver?: string;
}

export interface ReleasePipelineStepperProps {
  /** Ordered list of promotion pipeline stages */
  stages: ReleaseStage[];
  /** Currently active or inspected stage ID */
  selectedStageId?: string;
  /** Callback when a stage node is selected */
  onSelectStage?: (stage: ReleaseStage) => void;
  /** Callback to trigger promotion to the next environment */
  onPromoteStage?: (stage: ReleaseStage) => void;
  className?: string;
  style?: CSSProperties;
}

const STATUS_LABELS: Record<PipelineStageStatus, string> = {
  success: "Passed",
  running: "Deploying",
  pending: "Pending",
  failed: "Failed",
  awaiting_approval: "Awaiting Approval",
};

/**
 * `<ReleasePipelineStepper>` — Multi-stage enterprise release promotion stepper with health gates.
 *
 * @maturity stable
 */
export const ReleasePipelineStepper = forwardRef<
  HTMLDivElement,
  ReleasePipelineStepperProps
>(
  (
    {
      stages,
      selectedStageId,
      onSelectStage,
      onPromoteStage,
      className,
      style,
    },
    ref,
  ) => {
    const handleKeyDown = (stage: ReleaseStage) => (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectStage?.(stage);
      }
    };

    const containerClasses = [styles.stepper, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label="Release Pipeline Stages"
      >
        <div className={styles.stageTrack} role="list">
          {stages.map((stage, idx) => {
            const isSelected = stage.id === selectedStageId;
            const isLast = idx === stages.length - 1;

            return (
              <div key={stage.id} className={styles.stageWrapper}>
                <div
                  role="listitem"
                  tabIndex={0}
                  className={`${styles.stageCard} ${styles[stage.status]} ${isSelected ? styles.selected : ""}`}
                  onClick={() => onSelectStage?.(stage)}
                  onKeyDown={handleKeyDown(stage)}
                  aria-label={`${stage.name} stage: ${STATUS_LABELS[stage.status]}`}
                >
                  <div className={styles.cardHeader}>
                    <span className={styles.stageName}>{stage.name}</span>
                    <span className={`${styles.statusPill} ${styles[stage.status]}`}>
                      {stage.status === "running" && (
                        <span className={styles.spinner} aria-hidden="true" />
                      )}
                      {STATUS_LABELS[stage.status]}
                    </span>
                  </div>

                  <div className={styles.envTag}>{stage.environment}</div>

                  <div className={styles.cardMeta}>
                    {stage.version && (
                      <span className={styles.version}>{stage.version}</span>
                    )}
                    {stage.commitSha && (
                      <span className={styles.commit}>{stage.commitSha}</span>
                    )}
                    {stage.duration && (
                      <span className={styles.duration}>{stage.duration}</span>
                    )}
                  </div>

                  {stage.status === "awaiting_approval" && onPromoteStage && (
                    <button
                      type="button"
                      className={styles.approveBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onPromoteStage(stage);
                      }}
                      aria-label={`Approve release for ${stage.name}`}
                    >
                      Approve Release
                    </button>
                  )}
                </div>

                {!isLast && (
                  <div className={styles.connector} aria-hidden="true">
                    <div
                      className={`${styles.connectorLine} ${stage.status === "success" ? styles.lineSuccess : ""}`}
                    />
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={styles.connectorArrow}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

ReleasePipelineStepper.displayName = "ReleasePipelineStepper";
