import { forwardRef, type SelectHTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./select.module.css";

export const selectVariants = cva(styles.select, {
  variants: {
    error: {
      true: styles.hasError,
      false: "",
    },
  },
  defaultVariants: {
    error: false,
  },
});

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    Omit<VariantProps<typeof selectVariants>, "error"> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

/**
 * `<Select>` — Native accessible dropdown form control.
 * Standardized with cva, data-slot, and W3C APG combobox/select pattern.
 * @maturity stable
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options = [], error, helperText, className = "", id, children, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);
    const selectClasses = `${selectVariants({ error: !!error })} ${className}`.trim();

    return (
      <div data-slot="select" data-error={error ? "true" : undefined} className={styles.container}>
        {label && (
          <label htmlFor={selectId} data-slot="select-label" className={styles.label}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          data-slot="select-input"
          className={selectClasses}
          aria-invalid={error ? true : undefined}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
        </select>
        {error && <span data-slot="select-error" className={styles.errorText} role="alert">{error}</span>}
        {!error && helperText && <span data-slot="select-helper" className={styles.helperText}>{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
