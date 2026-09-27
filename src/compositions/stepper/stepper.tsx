"use client";

import React, { forwardRef, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./stepper.module.css";

export const stepperVariants = cva(styles.container, {
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

export const stepsVariants = stepperVariants;
export type StepperVariantProps = VariantProps<typeof stepperVariants>;

export interface StepItem {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepperProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onChange">,
    StepperVariantProps {
  steps: StepItem[];
  current: number; // 0-indexed
  onChange?: (stepIndex: number) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  testId?: string;
}

/**
 * Stepper displays a sequence of logical progress steps with completion state.
 * Follows Strata enterprise standards with cva, 4-tier density scaling, and data-slot annotations.
 *
 * @maturity stable
 */
export const Stepper = forwardRef<HTMLElement, StepperProps>(
  (
    {
      steps,
      current,
      onChange,
      density = "standard",
      className = "",
      testId = "stepper",
      ...rest
    },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        aria-label="Progress Stepper"
        data-slot="stepper"
        data-density={density}
        className={`${stepperVariants({ density })}${className ? ` ${className}` : ""}`.trim()}
        data-testid={testId}
        {...rest}
      >
        <ol className={styles.list} data-slot="stepper-list">
          {steps.map((step, idx) => {
            const isCompleted = idx < current;
            const isCurrent = idx === current;
            const isPending = idx > current;
            const stepState = isCompleted ? "completed" : isCurrent ? "active" : "pending";

            return (
              <li
                key={idx}
                data-slot="stepper-item"
                data-state={stepState}
                className={`${styles.stepItem} ${
                  isCompleted ? styles.completed : isCurrent ? styles.active : styles.pending
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <button
                  type="button"
                  data-slot="stepper-btn"
                  disabled={isPending || !onChange}
                  onClick={() => onChange?.(idx)}
                  className={styles.stepBtn}
                >
                  <span className={styles.indicator} data-slot="stepper-indicator" aria-hidden="true">
                    {isCompleted ? (
                      <Check size={12} strokeWidth={3} className={styles.checkIcon} />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </span>
                  <div className={styles.textWrap} data-slot="stepper-text-wrap">
                    <span className={styles.title} data-slot="stepper-title">{step.title}</span>
                    {step.description && (
                      <span className={styles.description} data-slot="stepper-description">{step.description}</span>
                    )}
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`${styles.line} ${
                      isCompleted ? styles.lineCompleted : ""
                    }`}
                    data-slot="stepper-line"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Stepper.displayName = "Stepper";

export const Steps = Stepper;
export type StepsProps = StepperProps;
export type StepperStep = StepItem;
