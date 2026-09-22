"use client";

import React, { forwardRef, useState } from "react";
import styles from "./chart-type-picker.module.css";

export type ChartType =
  | "bar"
  | "line"
  | "area"
  | "pie"
  | "donut"
  | "radar"
  | "stacked-bar"
  | "composed"
  | "funnel";

export interface ChartTypeOption {
  type: ChartType;
  label: string;
  icon: string;
}

const DEFAULT_OPTIONS: ChartTypeOption[] = [
  { type: "bar", label: "Bar Chart", icon: "📊" },
  { type: "line", label: "Line Chart", icon: "📈" },
  { type: "area", label: "Area Chart", icon: "📉" },
  { type: "pie", label: "Pie Chart", icon: "🥧" },
  { type: "donut", label: "Donut Chart", icon: "🍩" },
  { type: "stacked-bar", label: "Stacked Bar", icon: "📶" },
  { type: "radar", label: "Radar Chart", icon: "🎯" },
];

export interface ChartTypePickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: ChartType;
  onChange: (type: ChartType) => void;
  options?: ChartTypeOption[];
}

/**
 * ChartTypePicker renders an accessible popover dropdown allowing users to select
 * visualization types for analytical dashboards and widget builders.
 *
 * @maturity stable
 */
export const ChartTypePicker = forwardRef<
  HTMLDivElement,
  ChartTypePickerProps
>(
  (
    {
      value,
      onChange,
      options = DEFAULT_OPTIONS,
      className = "",
      ...rest
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((o) => o.type === value) || options[0];

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        {...rest}
      >
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={styles.triggerBtn}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Select chart type, current: ${selected?.label}`}
        >
          <span style={{ flexShrink: 0 }}>{selected?.icon}</span>
          <span>{selected?.label}</span>
          <span
            style={{
              fontSize: "var(--text-micro, 8px)",
              marginInlineStart: "2px",
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>

        {isOpen && (
          <>
            <div
              onClick={() => setIsOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 99 }}
              aria-hidden="true"
            />
            <div className={styles.dropdown} role="listbox">
              {options.map((opt) => {
                const isActive = opt.type === value;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      onChange(opt.type);
                      setIsOpen(false);
                    }}
                    className={`${styles.optionBtn} ${
                      isActive ? styles.optionBtnActive : ""
                    }`}
                    role="option"
                    aria-selected={isActive}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }
);

ChartTypePicker.displayName = "ChartTypePicker";
