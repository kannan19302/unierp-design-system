"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./input.module.css";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input sizing aligned with Strata 4-tier density */
  inputSize?: "sm" | "md" | "lg";
  /** Visual error state or error message flag */
  error?: boolean;
  /** Optional icon prefix element */
  leftIcon?: ReactNode;
  /** Optional icon suffix element */
  rightIcon?: ReactNode;
  /** Full width stretching */
  fullWidth?: boolean;
  /** Optional wrapper class */
  wrapperClassName?: string;
}

/**
 * `<Input>` — Atomic text input primitive adhering to Strata DL 3.0.
 *
 * Implements density scaling, focus rings, disabled/error states, and prefix/suffix slots.
 *
 * @maturity stable
 * @since 3.0.0
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      inputSize = "md",
      error = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      className = "",
      wrapperClassName = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    const hasIcons = Boolean(leftIcon || rightIcon);

    const inputClasses = [
      styles.input,
      styles[inputSize],
      error ? styles.error : "",
      leftIcon ? styles.hasLeftIcon : "",
      rightIcon ? styles.hasRightIcon : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (hasIcons || fullWidth) {
      const wrapperClasses = [
        styles.wrapper,
        styles[`wrapper_${inputSize}`],
        fullWidth ? styles.fullWidth : "",
        disabled ? styles.disabledWrapper : "",
        wrapperClassName,
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div className={wrapperClasses}>
          {leftIcon && (
            <span className={`${styles.iconSlot} ${styles.leftSlot}`} aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={error ? true : undefined}
            {...props}
          />
          {rightIcon && (
            <span className={`${styles.iconSlot} ${styles.rightSlot}`} aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
