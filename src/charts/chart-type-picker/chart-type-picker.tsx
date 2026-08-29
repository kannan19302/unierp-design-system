"use client";

import React, { useState } from "react";
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

export interface ChartTypePickerProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
  options?: ChartTypeOption[];
}

export const ChartTypePicker: React.FC<ChartTypePickerProps> = ({
  value,
  onChange,
  options = DEFAULT_OPTIONS,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o) => o.type === value) || options[0];

  return (
    <div className={styles.container}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={styles.triggerBtn}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ flexShrink: 0 }}>{selected?.icon}</span>
        <span>{selected?.label}</span>
        <span style={{ fontSize: "8px", marginLeft: "2px", flexShrink: 0 }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 99 }}
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
                  className={`${styles.optionBtn} ${isActive ? styles.optionBtnActive : ""}`}
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
};
