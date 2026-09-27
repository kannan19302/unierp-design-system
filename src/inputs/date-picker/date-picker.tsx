import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./date-picker.module.css";

export const datePickerVariants = cva(styles.wrapper, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"],
      compact: styles.compact,
      standard: styles.standard,
      comfortable: styles.comfortable,
    },
    invalid: {
      true: styles.invalid,
      false: "",
    },
    disabled: {
      true: styles.disabled,
      false: "",
    },
  },
  defaultVariants: {
    density: "standard",
    invalid: false,
    disabled: false,
  },
});

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL DatePicker primitive — input field with calendar icon prefix, min/max bounds, and native picker integration.
 * Standardized with cva, data-slot, and W3C APG datepicker pattern.
 */
export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "disabled">,
    VariantProps<typeof datePickerVariants> {
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  minDate?: string;
  maxDate?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      id,
      value = "",
      onChange,
      invalid = false,
      disabled = false,
      required = false,
      label,
      error,
      minDate,
      maxDate,
      density = "standard",
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error && inputId ? `${inputId}-error` : undefined;
    const isInvalid = invalid || !!error;

    const wrapperClass = `${datePickerVariants({ density, invalid: isInvalid, disabled })} ${className}`.trim();

    return (
      <div
        data-slot="date-picker"
        data-density={density}
        data-disabled={disabled ? "true" : undefined}
        data-invalid={isInvalid ? "true" : undefined}
        className={styles.rootContainer}
      >
        {label && (
          <label htmlFor={inputId} data-slot="date-picker-label" className={styles.label}>
            {label}
            {required && <span className={styles.requiredMark} aria-hidden="true"> *</span>}
          </label>
        )}
        <div data-slot="date-picker-wrapper" className={wrapperClass}>
          <CalendarIcon size={14} data-slot="date-picker-icon" className={styles.icon} aria-hidden="true" />
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={value}
            disabled={disabled || undefined}
            required={required}
            min={minDate}
            max={maxDate}
            aria-invalid={isInvalid || undefined}
            aria-describedby={errorId}
            aria-label={label ? undefined : (props["aria-label"] ?? "Select date")}
            onChange={(e) => onChange?.(e.target.value)}
            data-slot="date-picker-input"
            className={styles.input}
            {...props}
          />
        </div>
        {error && (
          <span id={errorId} data-slot="date-picker-error" className={styles.errorMessage} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";
