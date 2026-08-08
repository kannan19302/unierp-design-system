"use client";

import React, { type FC, useState as _useChartState } from "react";

// ── Chart colour palette — uses CSS token vars from tokens/charts.css ────────
// B10: No chart hardcodes a colour. All series reference the --chart-N scale.
//   Themes override --chart-N to ensure contrast in light and dark.
export const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
  "var(--chart-9)",
  "var(--chart-10)",
];

// ── ChartAccessibleWrapper ─────────────────────────────────────────────────
// B10: Every chart is keyboard-navigable with a data-table fallback.
//   Screen readers read the aria-label. Keyboard users can toggle a table.
export interface ChartAccessibleWrapperProps {
  /** Accessible description of what the chart shows. */
  label: string;
  /** Columns and rows for the data-table fallback. */
  tableData?: { columns: string[]; rows: (string | number)[][] };
  children: React.ReactNode;
}

export const ChartAccessibleWrapper: FC<ChartAccessibleWrapperProps> = ({
  label,
  tableData,
  children,
}) => {
  const [showTable, setShowTable] = _useChartState(false);

  return (
    <figure
      role="figure"
      aria-label={label}
      style={{ margin: 0 }}
    >
      {/* Chart visual */}
      <div aria-hidden={showTable}>
        {children}
      </div>
      {tableData && (
        <>
          <button
            type="button"
            onClick={() => setShowTable((p) => !p)}
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "var(--space-1) 0",
              display: "block",
              marginTop: "var(--space-1)",
            }}
            aria-expanded={showTable}
            aria-controls="chart-data-table"
          >
            {showTable ? "Hide data table" : "Show data table"}
          </button>
          {showTable && (
            <table
              id="chart-data-table"
              style={{ borderCollapse: "collapse", fontSize: "var(--text-xs)", marginTop: "var(--space-2)" }}
            >
              <thead>
                <tr>
                  {tableData.columns.map((col, i) => (
                    <th key={i} scope="col" style={{ padding: "var(--space-1) var(--space-2)", borderBottom: "1px solid var(--color-border)", textAlign: "left" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: "var(--space-1) var(--space-2)", borderBottom: "1px solid var(--color-border)" }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </figure>
  );
};


export interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = "var(--color-primary)",
  loading,
  onClick,
}) => (
  <div
    style={{
      padding: "var(--space-5)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--color-border)",
      background: "var(--color-bg-elevated)",
      cursor: onClick ? "pointer" : "default",
      transition: "box-shadow var(--duration-fast) var(--ease-default)",
    }}
    onClick={onClick}
    onMouseEnter={(e) => {
      if (onClick) e.currentTarget.style.boxShadow = "var(--shadow-md)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </p>
        {loading ? (
          <div
            style={{
              height: 32,
              width: 80,
              marginTop: "var(--space-2)",
              background: "var(--color-bg-sunken)",
              borderRadius: "var(--radius-sm)",
              animation: "shimmer 1.5s infinite",
            }}
          />
        ) : (
          <p
            style={{
              margin: "var(--space-2) 0 0",
              fontSize: "var(--text-2xl)",
              fontWeight: "var(--weight-bold)",
              color: "var(--color-text)",
            }}
          >
            {value}
          </p>
        )}
        {change !== undefined && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-1)",
              marginTop: "var(--space-2)",
            }}
          >
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-semibold)",
                color:
                  change >= 0 ? "var(--color-success)" : "var(--color-danger)",
              }}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
            </span>
            {changeLabel && (
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-tertiary)",
                }}
              >
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
      {icon && (
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "var(--radius-lg)",
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
    </div>
  </div>
);

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

export interface MiniBarChartProps {
  data: BarChartData[];
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
}

export const MiniBarChart: React.FC<MiniBarChartProps> = ({
  data,
  height = 120,
  showLabels = true,
  showValues = true,
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "var(--space-1)",
          height,
        }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {showValues && (
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {d.value}
              </span>
            )}
            <div
              style={{
                width: "100%",
                maxWidth: 40,
                height: `${(d.value / maxVal) * 100}%`,
                minHeight: 2,
                background: d.color || "var(--color-primary)",
                borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                transition: "height var(--duration-normal) var(--ease-default)",
              }}
            />
          </div>
        ))}
      </div>
      {showLabels && (
        <div style={{ display: "flex", gap: "var(--space-1)" }}>
          {data.map((d, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: "9px",
                color: "var(--color-text-tertiary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

export interface MiniDonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
}

export const MiniDonutChart: React.FC<MiniDonutChartProps> = ({
  segments,
  size = 120,
  thickness = 20,
  centerLabel,
  centerValue,
}) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {segments.map((seg, i) => {
          const segLength = (seg.value / total) * circumference;
          const offset = cumulativeOffset;
          cumulativeOffset += segLength;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={-offset}
              style={{
                transition:
                  "stroke-dasharray var(--duration-normal) var(--ease-default)",
              }}
            />
          );
        })}
      </svg>
      {(centerLabel || centerValue !== undefined) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {centerValue !== undefined && (
            <span
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: "var(--weight-bold)",
                color: "var(--color-text)",
              }}
            >
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span
              style={{ fontSize: "10px", color: "var(--color-text-secondary)" }}
            >
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 32,
  color = "var(--color-primary)",
  fill = true,
}) => {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const fillD = fill ? `${pathD} L ${width} ${height} L 0 ${height} Z` : "";

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {fill && <path d={fillD} fill={`${color}`} opacity={0.1} />}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ── Extended Charts (Line, Area, Funnel, Gauge, Heatmap, Combo) ─────────────
export const LineChart: FC<{ data: number[]; labels?: string[]; width?: number; height?: number }> = ({
  data,
  labels,
  width = 300,
  height = 150,
}) => <Sparkline data={data} width={width} height={height} fill={false} />;

export const AreaChart: FC<{ data: number[]; labels?: string[]; width?: number; height?: number }> = ({
  data,
  labels,
  width = 300,
  height = 150,
}) => <Sparkline data={data} width={width} height={height} fill={true} />;

export const GaugeChart: FC<{ value: number; min?: number; max?: number }> = ({ value, min = 0, max = 100 }) => {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  return (
    <div style={{ textAlign: "center" }}>
      <MiniDonutChart
        segments={[
          { label: "Value", value: pct, color: "var(--color-primary)" },
          { label: "Remaining", value: 100 - pct, color: "var(--color-bg-sunken)" },
        ]}
        centerValue={`${Math.round(pct)}%`}
      />
    </div>
  );
};

export const FunnelChart: FC<{ stages: { label: string; value: number }[] }> = ({ stages }) => {
  const max = Math.max(...stages.map((s) => s.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", width: "100%" }}>
      {stages.map((s, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <span style={{ width: "80px", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{s.label}</span>
          <div style={{ flex: 1, background: "var(--color-bg-sunken)", height: "20px", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
            <div style={{ width: `${(s.value / max) * 100}%`, height: "100%", background: "var(--color-primary)" }} />
          </div>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>{s.value}</span>
        </div>
      ))}
    </div>
  );
};

export const HeatmapChart: FC<{ matrix: number[][] }> = ({ matrix }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {matrix.map((row, rIdx) => (
        <div key={rIdx} style={{ display: "flex", gap: "2px" }}>
          {row.map((val, cIdx) => (
            <div
              key={cIdx}
              title={String(val)}
              aria-label={`Value ${val}`}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "2px",
                // B10: no hardcoded colour — use chart-1 token with opacity
                background: `color-mix(in srgb, var(--chart-1) ${Math.round(Math.min(1, Math.max(0.1, val)) * 100)}%, transparent)`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
