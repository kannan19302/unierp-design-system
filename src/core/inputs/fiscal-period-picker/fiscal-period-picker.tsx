"use client";

import { forwardRef, useId, type HTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./fiscal-period-picker.module.css";

export interface FiscalPeriod {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

/**
 * @maturity stable
 * @since 1.0.0
 * Strata DL FiscalPeriodPicker primitive — quarters (Q1-Q4) accounting period selector supporting custom start months.
 */
export interface FiscalPeriodPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  id?: string;
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
  fiscalYear?: number;
  fiscalYearStartMonth?: number;
  disabled?: boolean;
  invalid?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function buildFiscalPeriods(fiscalYear: number, startMonth: number): FiscalPeriod[] {
  const sm = startMonth - 1;
  const periods: FiscalPeriod[] = [];
  for (let q = 0; q < 4; q++) {
    const qStartMonth = (sm + q * 3) % 12;
    const qEndMonth = (sm + q * 3 + 2) % 12;
    const calYearOffset = Math.floor((sm + q * 3) / 12);
    const startYear = fiscalYear - (startMonth > 1 ? 1 : 0) + calYearOffset;
    const endYear = fiscalYear - (startMonth > 1 ? 1 : 0) + Math.floor((sm + q * 3 + 2) / 12);
    const startDate = new Date(startYear, qStartMonth, 1);
    const endDate = new Date(endYear, qEndMonth + 1, 0);

    periods.push({
      label: `Q${q + 1} (${MONTH_NAMES[qStartMonth]}–${MONTH_NAMES[qEndMonth]} FY${fiscalYear})`,
      value: `FY${fiscalYear}-Q${q + 1}`,
      startDate,
      endDate,
    });
  }
  return periods;
}

export const FiscalPeriodPicker = forwardRef<HTMLDivElement, FiscalPeriodPickerProps>(({
  id,
  selectedPeriod,
  onSelectPeriod,
  fiscalYear = new Date().getFullYear(),
  fiscalYearStartMonth = 1,
  disabled = false,
  invalid = false,
  required = false,
  label,
  error,
  density,
  className = "",
  ...props
}, ref) => {
  const periods = buildFiscalPeriods(fiscalYear, fiscalYearStartMonth);
  const currentValue = selectedPeriod ?? (periods[0]?.value || "");

  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = error && selectId ? `${selectId}-error` : undefined;

  const containerClass = [
    styles.container,
    density ? styles[density] : "",
    invalid || !!error ? styles.invalid : "",
    disabled ? styles.disabled : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} className={styles.rootContainer} data-density={density} {...props}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.requiredMark} aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={containerClass}>
        <span className={styles.fyLabel}>FY{fiscalYear}:</span>
        <div className={styles.selectWrapper}>
          <select
            id={selectId}
            value={currentValue}
            disabled={disabled}
            required={required}
            aria-invalid={invalid || !!error || undefined}
            aria-describedby={errorId}
            onChange={(e) => onSelectPeriod?.(e.target.value)}
            aria-label={label ? undefined : "Fiscal period"}
            className={styles.select}
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className={styles.arrow} aria-hidden="true" />
        </div>
      </div>
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

FiscalPeriodPicker.displayName = "FiscalPeriodPicker";
