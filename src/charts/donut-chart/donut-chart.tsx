"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./donut-chart.module.css";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export const donutChartVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type DonutChartDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface DonutChartProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof donutChartVariants> {
  segments?: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
  density?: DonutChartDensity;
}

const defaultSpecsByDensity: Record<DonutChartDensity, { size: number; thickness: number }> = {
  "ultra-compact": { size: 80, thickness: 12 },
  compact: { size: 110, thickness: 16 },
  standard: { size: 140, thickness: 22 },
  comfortable: { size: 180, thickness: 28 },
};

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
      density = "standard",
      size,
      thickness,
      centerLabel,
      centerValue,
      className = "",
      ...rest
    },
    ref
  ) => {
    const specs = defaultSpecsByDensity[density];
    const actualSize = size ?? specs.size;
    const actualThickness = thickness ?? specs.thickness;

    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
    const radius = (actualSize - actualThickness) / 2;
    const circumference = 2 * Math.PI * radius;
    let cumulativeOffset = 0;

    return (
      <div
        ref={ref}
        data-slot="donut-chart"
        data-density={density}
        className={donutChartVariants({ density, className })}
        role="figure"
        aria-label={centerLabel ? `${centerLabel}: ${centerValue ?? ""}` : "Donut Chart"}
        style={{ inlineSize: actualSize, blockSize: actualSize }}
        {...rest}
      >
        <svg
          width={actualSize}
          height={actualSize}
          viewBox={`0 0 ${actualSize} ${actualSize}`}
          className={styles.svg}
          data-slot="donut-chart-svg"
        >
          {segments.map((seg, i) => {
            const fraction = seg.value / total;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeOffset;
            cumulativeOffset += fraction * circumference;
            return (
              <circle
                key={i}
                cx={actualSize / 2}
                cy={actualSize / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={actualThickness}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className={styles.segment}
                data-slot="donut-chart-segment"
              />
            );
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className={styles.centerText} data-slot="donut-chart-center">
            {centerValue && (
              <div className={styles.centerValue} data-slot="donut-chart-center-value">
                {centerValue}
              </div>
            )}
            {centerLabel && (
              <div className={styles.centerLabel} data-slot="donut-chart-center-label">
                {centerLabel}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

DonutChart.displayName = "DonutChart";
