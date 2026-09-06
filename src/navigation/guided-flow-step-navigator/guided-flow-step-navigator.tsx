import React from "react";
import styles from "./guided-flow-step-navigator.module.css";

export type GuidedStepStatus = "completed" | "in-progress" | "error" | "locked" | "optional";

export interface GuidedStep {
  id: string;
  title: string;
  description?: string;
  status: GuidedStepStatus;
  errorCount?: number;
  timeEstimate?: string;
}

export interface GuidedFlowStepNavigatorProps {
  steps: GuidedStep[];
  activeStepId: string;
  onStepClick?: (stepId: string) => void;
  title?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
  testId?: string;
}

export const GuidedFlowStepNavigator: React.FC<GuidedFlowStepNavigatorProps> = ({
  steps,
  activeStepId,
  onStepClick,
  title = "Guided Workflow Progression",
  density = "standard",
  className = "",
  testId = "guided-flow-step-navigator",
}) => {
  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progressPct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const renderIndicator = (step: GuidedStep, index: number) => {
    switch (step.status) {
      case "completed":
        return <span className={`${styles.stepIndicator ?? ""} ${styles.indicatorCompleted ?? ""}`}>✓</span>;
      case "error":
        return <span className={`${styles.stepIndicator ?? ""} ${styles.indicatorError ?? ""}`}>!</span>;
      case "in-progress":
        return <span className={`${styles.stepIndicator ?? ""} ${styles.indicatorActive ?? ""}`}>{index + 1}</span>;
      default:
        return <span className={styles.stepIndicator ?? ""}>{index + 1}</span>;
    }
  };

  return (
    <nav
      className={`${styles.navigatorContainer ?? ""} ${className}`}
      data-density={density}
      data-testid={testId}
      aria-label={title}
    >
      <div className={styles.header ?? ""}>
        <h4 className={styles.title ?? ""}>{title}</h4>
        <span className={styles.progressInfo ?? ""}>
          {completedCount} of {steps.length} completed ({progressPct}%)
        </span>
      </div>

      <div
        className={styles.progressBar ?? ""}
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Workflow progress"
      >
        <div
          className={styles.progressFill ?? ""}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <ol className={styles.stepsList ?? ""} role="list">
        {steps.map((step, idx) => {
          const isActive = step.id === activeStepId;
          const isLocked = step.status === "locked";

          return (
            <li key={step.id}>
              <button
                type="button"
                className={`${styles.stepRow ?? ""} ${isActive ? (styles.stepActive ?? "") : ""} ${isLocked ? (styles.stepLocked ?? "") : ""}`}
                onClick={() => !isLocked && onStepClick?.(step.id)}
                disabled={isLocked}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.title} (${step.status})${step.errorCount ? `, ${step.errorCount} errors` : ""}`}
                style={{ width: "100%", textAlign: "left" }}
              >
                <div className={styles.stepLeft ?? ""}>
                  {renderIndicator(step, idx)}
                  <div className={styles.stepContent ?? ""}>
                    <span className={styles.stepTitle ?? ""}>{step.title}</span>
                    {step.description && (
                      <span className={styles.stepDesc ?? ""}>{step.description}</span>
                    )}
                  </div>
                </div>

                <div className={styles.stepRight ?? ""}>
                  {typeof step.errorCount === "number" && step.errorCount > 0 && (
                    <span className={styles.errorBadge ?? ""}>
                      {step.errorCount} issues
                    </span>
                  )}
                  {step.timeEstimate && (
                    <span className={styles.timeEstimate ?? ""}>{step.timeEstimate}</span>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
