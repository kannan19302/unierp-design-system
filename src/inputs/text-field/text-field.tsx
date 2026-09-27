"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./text-field.module.css";

/**
 * Class variance authority definitions for Input.
 * Compatible with shadcn/ui community standards and Strata Design tokens.
 */
export const inputVariants = cva(styles.input, {
  variants: {
    inputSize: {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    },
    error: {
      true: styles.error,
      false: "",
    },
    hasLeftIcon: {
      true: styles.hasLeftIcon,
      false: "",
    },
    hasRightIcon: {
      true: styles.hasRightIcon,
      false: "",
    },
  },
  defaultVariants: {
    inputSize: "md",
    error: false,
    hasLeftIcon: false,
    hasRightIcon: false,
  },
});

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
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
 * Follows shadcn/ui and Strata design system standards with full cva, data-slot, and APG compliance.
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
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const isInvalid = Boolean(error || ariaInvalid === true || ariaInvalid === "true");
    const hasLeftIcon = Boolean(leftIcon);
    const hasRightIcon = Boolean(rightIcon);
    const hasIcons = hasLeftIcon || hasRightIcon;

    const inputClasses = inputVariants({
      inputSize,
      error: isInvalid,
      hasLeftIcon,
      hasRightIcon,
      className,
    });

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
        <div data-slot="input-wrapper" className={wrapperClasses}>
          {leftIcon && (
            <span
              data-slot="left-icon"
              className={`${styles.iconSlot} ${styles.leftSlot}`}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            data-slot="input"
            data-size={inputSize}
            data-error={isInvalid ? "true" : undefined}
            className={inputClasses}
            aria-invalid={isInvalid ? true : undefined}
            {...props}
          />
          {rightIcon && (
            <span
              data-slot="right-icon"
              className={`${styles.iconSlot} ${styles.rightSlot}`}
              aria-hidden="true"
            >
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
        data-slot="input"
        data-size={inputSize}
        data-error={isInvalid ? "true" : undefined}
        className={inputClasses}
        aria-invalid={isInvalid ? true : undefined}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

/** Canonical alias for Input supporting standard shadcn & enterprise naming */
export const TextField = Input;
export type TextFieldProps = InputProps;
