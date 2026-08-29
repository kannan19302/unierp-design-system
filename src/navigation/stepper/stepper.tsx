"use client";

import { type FC, type ReactNode } from "react";
import { Check } from "lucide-react";
import styles from "./stepper.module.css";

export interface StepItem {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export interface StepperProps {
  steps: StepItem[];
  current: number; // 0-indexed
  onChange?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: FC<StepperProps> = ({
  steps,
  current,
  onChange,
  className = "",
}) => {
  return (
    <nav
      aria-label="Progress Stepper"
      className={`${styles.container} ${className}`.trim()}
    >
      <ol className={styles.list}>
        {steps.map((step, idx) => {
          const isCompleted = idx < current;
          const isCurrent = idx === current;
          const isPending = idx > current;

          return (
            <li
              key={idx}
              className={`${styles.stepItem} ${
                isCompleted ? styles.completed : isCurrent ? styles.active : styles.pending
              }`}
              aria-current={isCurrent ? "step" : undefined}
            >
              <button
                type="button"
                disabled={isPending || !onChange}
                onClick={() => onChange?.(idx)}
                className={styles.stepBtn}
              >
                <span className={styles.indicator} aria-hidden="true">
                  {isCompleted ? (
                    <Check size={12} strokeWidth={3} className={styles.checkIcon} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </span>
                <div className={styles.textWrap}>
                  <span className={styles.title}>{step.title}</span>
                  {step.description && (
                    <span className={styles.description}>{step.description}</span>
                  )}
                </div>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`${styles.line} ${
                    isCompleted ? styles.lineCompleted : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const Steps = Stepper;
export type StepsProps = StepperProps;
export type StepperStep = StepItem;
