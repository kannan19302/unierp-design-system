"use client";

import React, { forwardRef } from "react";
import styles from "./candlestick-chart.module.css";

export interface CandlestickDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: CandlestickDataPoint[];
  height?: number;
  bullColor?: string;
  bearColor?: string;
}

/**
 * CandlestickChart displays financial time-series market pricing (open, high, low, close)
 * with bullish and bearish color coding.
 *
 * @maturity stable
 */
export const CandlestickChart = forwardRef<
  HTMLDivElement,
  CandlestickChartProps
>(
  (
    {
      data,
      height = 280,
      bullColor = "var(--color-success)",
      bearColor = "var(--color-error)",
      className = "",
      ...rest
    },
    ref
  ) => {
    const allValues = data.flatMap((d) => [d.high, d.low]);
    const minVal = allValues.length ? Math.min(...allValues) : 0;
    const maxVal = allValues.length ? Math.max(...allValues) : 100;
    const range = maxVal - minVal || 1;
    const barWidth = Math.max(6, Math.min(20, 400 / (data.length || 1) - 2));
    const svgWidth = data.length * (barWidth + 4) + 40;

    const yScale = (v: number) =>
      ((maxVal - v) / range) * (height - 50) + 20;

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="img"
        aria-label="Candlestick chart"
        {...rest}
      >
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${svgWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {data.map((d, i) => {
            const isBull = d.close >= d.open;
            const color = isBull ? bullColor : bearColor;
            const bodyTop = yScale(Math.max(d.open, d.close));
            const bodyBottom = yScale(Math.min(d.open, d.close));
            const bodyH = Math.max(bodyBottom - bodyTop, 1);
            const x = 20 + i * (barWidth + 4);
            const cx = x + barWidth / 2;
            return (
              <g key={d.date || i}>
                <line
                  x1={cx}
                  y1={yScale(d.high)}
                  x2={cx}
                  y2={yScale(d.low)}
                  stroke={color}
                  strokeWidth={1}
                />
                <rect
                  x={x}
                  y={bodyTop}
                  width={barWidth}
                  height={bodyH}
                  fill={color}
                  rx={1}
                  opacity={0.85}
                />
                <title>{`${d.date} O:${d.open} H:${d.high} L:${d.low} C:${d.close}`}</title>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }
);

CandlestickChart.displayName = "CandlestickChart";
