"use client";

import { forwardRef, type HTMLAttributes } from "react";
import styles from "./donut-chart.module.css";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  segments?: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

/**
 * DonutChart — Proportion and ratio visualization with Strata color tokens.
 */
export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      segments = [
        { label: "Active", value: 65, color: "var(--chart-1)" },
        { label: "Pending", value: 25, color: "var(--chart-2)" },
        { label: "Closed", value: 10, color: "var(--chart-3)" },
      ],
      size = 140,
      thickness = 22,
      centerLabel,
      centerValue,
      className = "",
      ...rest
    },
    ref
  ) => {
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
    const radius = (size - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    let cumulativeOffset = 0;

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        style={{ width: size, height: size }}
        {...rest}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
          {segments.map((seg, i) => {
            const fraction = seg.value / total;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeOffset;
            cumulativeOffset += fraction * circumference;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={styles.segment}
              />
            );
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className={styles.centerText}>
            {centerValue && <div className={styles.centerValue}>{centerValue}</div>}
            {centerLabel && <div className={styles.centerLabel}>{centerLabel}</div>}
          </div>
        )}
      </div>
    );
  }
);

DonutChart.displayName = "DonutChart";

