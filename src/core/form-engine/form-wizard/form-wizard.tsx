"use client";

import { useState, type ReactNode, type FC } from "react";
import { Check, ArrowRight, ArrowLeft, Send } from "lucide-react";
import styles from "./form-wizard.module.css";

export interface WizardStep {
  id: string;
  title: string;
  subtitle?: string;
  component: ReactNode;
  validate?: () => boolean | Promise<boolean>;
}

export interface FormWizardProps {
  title: string;
  subtitle?: string;
  steps: WizardStep[];
  onComplete?: () => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  className?: string;
}

export const FormWizard: FC<FormWizardProps> = ({
  title,
  subtitle,
  steps,
  onComplete,
  onCancel,
  submitLabel = "Complete Setup",
  className = "",
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = async () => {
    if (currentStep?.validate) {
      const isValid = await currentStep.validate();
      if (!isValid) return;
    }

    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]));

    if (isLastStep) {
      setIsSubmitting(true);
      try {
        await onComplete?.();
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className={`${styles.container} ${className}`} role="region" aria-label="Multi-step form wizard">
      <div className={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700 }}>{title}</h3>
            {subtitle && (
              <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                {subtitle}
              </p>
            )}
          </div>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-brand)" }}>
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>

        <div className={styles.stepperRow}>
          {steps.map((step, idx) => {
            const isCompleted = completedSteps.has(idx);
            const isActive = idx === currentStepIndex;

            let stepStateClass = "";
            if (isActive) stepStateClass = styles.stepActive || "";
            else if (isCompleted) stepStateClass = styles.stepCompleted || "";

            return (
              <div
                key={step.id}
                className={`${styles.stepNode || ""} ${stepStateClass}`}
                onClick={() => isCompleted && setCurrentStepIndex(idx)}
                role="button"
                tabIndex={0}
                aria-label={`Step ${idx + 1}: ${step.title}`}
              >
                <div className={styles.stepCircle}>
                  {isCompleted ? <Check size={14} /> : idx + 1}
                </div>
                <span className={styles.stepLabel}>{step.title}</span>
              </div>
            );
          })}
        </div>

      </div>

      <div className={styles.content}>
        {currentStep?.component}
      </div>

      <div className={styles.footer}>
        <div>
          {onCancel && (
            <button type="button" className={styles.btn} onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            type="button"
            className={`${styles.btn} ${isFirstStep ? styles.btnDisabled : ""}`}
            onClick={handlePrev}
            disabled={isFirstStep}
          >
            <ArrowLeft size={14} /> Back
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary} ${isSubmitting ? styles.btnDisabled : ""}`}
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isLastStep ? (
              <>
                <Send size={14} /> {submitLabel}
              </>
            ) : (
              <>
                Next Step <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
