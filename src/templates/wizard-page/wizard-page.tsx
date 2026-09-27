import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./wizard-page.module.css";

export const wizardPageVariants = cva(styles.wizard, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isOptional?: boolean;
}

export interface MultiStepWizardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wizardPageVariants> {
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
      density = "standard",
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
        className={`${wizardPageVariants({ density })} ${className}`}
        data-slot="wizard-page"
        data-density={density}
        role="region"
        aria-label="Multi-step wizard form"
        {...props}
      >
        <nav
          className={styles.stepper}
          data-slot="wizard-page-stepper"
          aria-label="Wizard Steps"
        >
          <ol className={styles.stepList} data-slot="wizard-page-step-list">
            {steps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isCurrent = idx === activeStep;
              return (
                <li
                  key={step.id}
                  className={`${styles.stepItem} ${
                    isCurrent ? styles.current : isCompleted ? styles.completed : ""
                  }`}
                  data-slot="wizard-page-step-item"
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <div
                    className={styles.stepIndicator}
                    data-slot="wizard-page-step-indicator"
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <div
                    className={styles.stepDetails}
                    data-slot="wizard-page-step-details"
                  >
                    <span
                      className={styles.stepTitle}
                      data-slot="wizard-page-step-title"
                    >
                      {step.title}
                    </span>
                    {step.description && (
                      <span
                        className={styles.stepDesc}
                        data-slot="wizard-page-step-desc"
                      >
                        {step.description}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={styles.contentArea} data-slot="wizard-page-content-area">
          {children || (
            <div
              className={styles.stepPlaceholder}
              data-slot="wizard-page-step-placeholder"
            >
              Step {activeStep + 1}: {steps[activeStep]?.title} content
            </div>
          )}
        </div>

        <div className={styles.actionBar} data-slot="wizard-page-action-bar">
          <button
            type="button"
            className={styles.backBtn}
            data-slot="wizard-page-back-button"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </button>

          <button
            type="button"
            className={styles.nextBtn}
            data-slot="wizard-page-next-button"
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

export const WizardPageTemplate = MultiStepWizard;
