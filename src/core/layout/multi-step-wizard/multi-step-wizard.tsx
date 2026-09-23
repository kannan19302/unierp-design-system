import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import styles from "./multi-step-wizard.module.css";

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

export interface MultiStepWizardProps extends HTMLAttributes<HTMLDivElement> {
  steps?: WizardStep[];
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  children?: ReactNode;
}

export const MultiStepWizard = forwardRef<HTMLDivElement, MultiStepWizardProps>(
  (
    {
      steps = [
        { id: "s1", title: "General Info", description: "Entity details" },
        { id: "s2", title: "Line Items", description: "Product configuration" },
        { id: "s3", title: "Review & Sign", description: "Final validation" },
      ],
      currentStep: controlledStep,
      onStepChange,
      onComplete,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const [internalStep, setInternalStep] = useState(0);
    const activeStep = controlledStep !== undefined ? controlledStep : internalStep;

    const handleNext = () => {
      if (activeStep < steps.length - 1) {
        const next = activeStep + 1;
        setInternalStep(next);
        onStepChange?.(next);
      } else {
        onComplete?.();
      }
    };

    const handleBack = () => {
      if (activeStep > 0) {
        const prev = activeStep - 1;
        setInternalStep(prev);
        onStepChange?.(prev);
      }
    };

    return (
      <div
        ref={ref}
        className={`${styles.wizard} ${className}`}
        role="region"
        aria-label="Multi-step wizard form"
        {...props}
      >
        <nav className={styles.stepper} aria-label="Wizard Steps">
          <ol className={styles.stepList}>
            {steps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isCurrent = idx === activeStep;
              return (
                <li
                  key={step.id}
                  className={`${styles.stepItem} ${
                    isCurrent ? styles.current : isCompleted ? styles.completed : ""
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <div className={styles.stepIndicator}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <div className={styles.stepDetails}>
                    <span className={styles.stepTitle}>{step.title}</span>
                    {step.description && (
                      <span className={styles.stepDesc}>{step.description}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={styles.contentArea}>
          {children || (
            <div className={styles.stepPlaceholder}>
              Step {activeStep + 1}: {steps[activeStep]?.title} content
            </div>
          )}
        </div>

        <div className={styles.actionBar}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </button>

          <button
            type="button"
            className={styles.nextBtn}
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? "Complete Transaction" : "Continue"}
          </button>
        </div>
      </div>
    );
  }
);

MultiStepWizard.displayName = "MultiStepWizard";
