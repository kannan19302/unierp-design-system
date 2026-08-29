"use client";

import { type FC } from "react";
import styles from "./fiscal-period-picker.module.css";

export interface FiscalPeriod {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

export interface FiscalPeriodPickerProps {
  id?: string;
  selectedPeriod?: string;
  onSelectPeriod?: (period: string) => void;
  fiscalYear?: number;
  fiscalYearStartMonth?: number;
  disabled?: boolean;
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

export const FiscalPeriodPicker: FC<FiscalPeriodPickerProps> = ({
  id,
  selectedPeriod,
  onSelectPeriod,
  fiscalYear = new Date().getFullYear(),
  fiscalYearStartMonth = 1,
  disabled = false,
  className = "",
}) => {
  const periods = buildFiscalPeriods(fiscalYear, fiscalYearStartMonth);
  const currentValue = selectedPeriod ?? (periods[0]?.value || "");

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""} ${className}`.trim()}>
      <span className={styles.fyLabel}>FY{fiscalYear}:</span>
      <div className={styles.selectWrapper}>
        <select
          id={id}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => onSelectPeriod?.(e.target.value)}
          aria-label="Fiscal period"
          className={styles.select}
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <span className={styles.arrow} aria-hidden="true" />
      </div>
    </div>
  );
};
