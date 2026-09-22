"use client";

import {
  forwardRef,
  useState,
  type CSSProperties,
} from "react";
import styles from "./dual-axis-telemetry-chart.module.css";

export interface TelemetryDataPoint {
  time: string;
  successRate: number; // e.g. 99.95 (%)
  latencyMs: number; // e.g. 35 (ms)
}

export interface DualAxisTelemetryChartProps {
  /** Array of time-series telemetry data points */
  data: TelemetryDataPoint[];
  /** Chart title */
  title?: string;
  /** Height in pixels of chart canvas */
  height?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * `<DualAxisTelemetryChart>` — Time-series dual-axis chart correlating success rate percentage with P95 latency.
 *
 * @maturity stable
 */
export const DualAxisTelemetryChart = forwardRef<
  HTMLDivElement,
  DualAxisTelemetryChartProps
>(
  (
    {
      data,
      title = "API Telemetry: Success Rate vs P95 Latency",
      height = 240,
      className,
      style,
    },
    ref,
  ) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Dynamic scale calculations
    const minRate = 98.0;
    const maxRate = 100.0;
    const maxLatency = Math.max(...data.map((d) => d.latencyMs), 100);

    const chartWidth = 600;
    const chartHeight = height - 40;
    const paddingX = 40;
    const paddingY = 20;
    const plotWidth = chartWidth - paddingX * 2;
    const plotHeight = chartHeight - paddingY * 2;

    const getX = (index: number) => {
      if (data.length <= 1) return paddingX + plotWidth / 2;
      return paddingX + (index / (data.length - 1)) * plotWidth;
    };

    const getRateY = (rate: number) => {
      const normalized = (rate - minRate) / (maxRate - minRate);
      return paddingY + plotHeight - normalized * plotHeight;
    };

    const getLatencyHeight = (latency: number) => {
      return (latency / maxLatency) * plotHeight;
    };

    // Construct SVG line path for success rate
    const linePath = data
      .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getRateY(d.successRate)}`)
      .join(" ");

    const containerClasses = [styles.chartContainer, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label={title}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.legend}>
            <span className={styles.legendRate}>
              <span className={styles.rateDot} aria-hidden="true" />
              Success Rate (%)
            </span>
            <span className={styles.legendLatency}>
              <span className={styles.latencySquare} aria-hidden="true" />
              P95 Latency (ms)
            </span>
          </div>
        </div>

        <div className={styles.svgWrapper}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className={styles.svg}
            role="img"
            aria-label={`Time series telemetry graph with ${data.length} sample points.`}
          >
            {/* Grid lines */}
            <line
              x1={paddingX}
              y1={paddingY}
              x2={chartWidth - paddingX}
              y2={paddingY}
              className={styles.gridLine}
            />
            <line
              x1={paddingX}
              y1={paddingY + plotHeight / 2}
              x2={chartWidth - paddingX}
              y2={paddingY + plotHeight / 2}
              className={styles.gridLine}
            />
            <line
              x1={paddingX}
              y1={paddingY + plotHeight}
              x2={chartWidth - paddingX}
              y2={paddingY + plotHeight}
              className={styles.gridLine}
            />

            {/* Y Axis Labels */}
            <text x={paddingX - 6} y={paddingY + 4} className={styles.axisLabel} textAnchor="end">
              100%
            </text>
            <text x={paddingX - 6} y={paddingY + plotHeight} className={styles.axisLabel} textAnchor="end">
              98%
            </text>
            <text x={chartWidth - paddingX + 6} y={paddingY + 4} className={styles.axisLabel} textAnchor="start">
              {maxLatency}ms
            </text>
            <text x={chartWidth - paddingX + 6} y={paddingY + plotHeight} className={styles.axisLabel} textAnchor="start">
              0ms
            </text>

            {/* Latency Bars */}
            {data.map((d, i) => {
              const x = getX(i) - 6;
              const barH = getLatencyHeight(d.latencyMs);
              const y = paddingY + plotHeight - barH;

              return (
                <rect
                  key={`bar-${i}`}
                  x={x}
                  y={y}
                  width="12"
                  height={barH}
                  className={`${styles.latencyBar} ${hoveredIndex === i ? styles.barHovered : ""}`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <title>{`${d.time}: Latency ${d.latencyMs}ms`}</title>
                </rect>
              );
            })}

            {/* Success Rate Line */}
            <path d={linePath} fill="none" className={styles.rateLine} />

            {/* Success Rate Points */}
            {data.map((d, i) => (
              <circle
                key={`point-${i}`}
                cx={getX(i)}
                cy={getRateY(d.successRate)}
                r={hoveredIndex === i ? 5 : 3.5}
                className={styles.ratePoint}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <title>{`${d.time}: Success Rate ${d.successRate}%`}</title>
              </circle>
            ))}

            {/* X Axis Time Labels */}
            {data.map((d, i) => {
              if (i % Math.ceil(data.length / 5) !== 0 && i !== data.length - 1) return null;
              return (
                <text
                  key={`time-${i}`}
                  x={getX(i)}
                  y={chartHeight - 4}
                  className={styles.xAxisLabel}
                  textAnchor="middle"
                >
                  {d.time}
                </text>
              );
            })}
          </svg>

          {/* Accessible data table for assistive technology */}
          <table className={styles.srTable}>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">Timestamp</th>
                <th scope="col">Success Rate</th>
                <th scope="col">P95 Latency</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.time}>
                  <td>{row.time}</td>
                  <td>{row.successRate}%</td>
                  <td>{row.latencyMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className={styles.tooltip}>
            <span className={styles.tooltipTime}>{data[hoveredIndex].time}</span>
            <div className={styles.tooltipMetrics}>
              <span className={styles.tooltipRate}>
                Rate: {data[hoveredIndex].successRate}%
              </span>
              <span className={styles.tooltipLatency}>
                Latency: {data[hoveredIndex].latencyMs}ms
              </span>
            </div>
          </div>
        )}
      </div>
    );
  },
);

DualAxisTelemetryChart.displayName = "DualAxisTelemetryChart";
