"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  ComposedChart,
} from "recharts";
import { ChartTypePicker, type ChartType } from "../chart-type-picker";
import styles from "./dashboard-chart.module.css";

// Theme-aware categorical palette (tokens defined in @kannan19302/ui-tokens charts.css)
const FALLBACK_COLORS = [
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

export interface ChartSeries {
  dataKey: string;
  name: string;
  color?: string;
  type?: "bar" | "line" | "area";
}

export interface DashboardChartConfig {
  xAxisKey?: string;
  series: ChartSeries[];
  /** For pie/donut: the key containing the value */
  valueKey?: string;
  /** For pie/donut: the key containing the label */
  nameKey?: string;
}

export interface DashboardChartProps {
  title: string;
  subtitle?: string;
  data: Record<string, unknown>[];
  config: DashboardChartConfig;
  defaultChartType?: ChartType;
  allowedChartTypes?: ChartType[];
  height?: number;
  loading?: boolean;
  actions?: React.ReactNode;
}

const LoadingSkeleton: React.FC<{ height: number }> = ({ height }) => (
  <div
    style={{
      height,
      background: "var(--color-bg-sunken)",
      borderRadius: "var(--radius-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-text-tertiary)",
      fontSize: "var(--text-sm)",
      animation: "shimmer 1.5s infinite",
    }}
  >
    Loading chart…
  </div>
);

const NoDataPlaceholder: React.FC<{ height: number }> = ({ height }) => (
  <div
    style={{
      height,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-2)",
      color: "var(--color-text-tertiary)",
      background: "var(--color-bg-sunken)",
      border: "1px dashed var(--color-border-strong, #cbd5e1)",
      borderRadius: "var(--radius-md)",
    }}
  >
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </svg>
    <span
      style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium, 500)" }}
    >
      No data available
    </span>
  </div>
);

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: "var(--color-surface-elevated, #ffffff)",
        border: "1px solid var(--color-border-default, #e2e8f0)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-2) var(--space-3)",
        boxShadow: "var(--shadow-md)",
        fontSize: "var(--text-xs)",
      }}
    >
      {label && (
        <p
          style={{
            margin: "0 0 4px",
            fontWeight: "var(--weight-semibold, 600)",
            color: "var(--color-text-primary)",
          }}
        >
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-1)",
            margin: "2px 0",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: entry.color,
              flexShrink: 0,
            }}
          />
          <span style={{ color: "var(--color-text-secondary)" }}>
            {entry.name}:
          </span>
          <span
            style={{
              fontWeight: "var(--weight-semibold, 600)",
              color: "var(--color-text-primary)",
            }}
          >
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const DashboardChart: React.FC<DashboardChartProps> = ({
  title,
  subtitle,
  data,
  config,
  defaultChartType = "bar",
  allowedChartTypes,
  height = 300,
  loading = false,
  actions,
}) => {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const {
    xAxisKey = "name",
    series,
    valueKey = "value",
    nameKey = "name",
  } = config;

  const renderChart = () => {
    if (loading) return <LoadingSkeleton height={height} />;
    if (!data || data.length === 0)
      return <NoDataPlaceholder height={height} />;

    const commonAxisProps = {
      fontSize: 11,
      stroke: "var(--color-text-tertiary)",
      tickLine: false,
      axisLine: false,
    };

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-default, #e2e8f0)"
                vertical={false}
              />
              <XAxis dataKey={xAxisKey} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              {series.length > 1 && <Legend />}
              {series.map((s, i) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  fill={s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "stacked-bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-default, #e2e8f0)"
                vertical={false}
              />
              <XAxis dataKey={xAxisKey} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {series.map((s, i) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  name={s.name}
                  stackId="a"
                  fill={s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  radius={i === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-default, #e2e8f0)"
                vertical={false}
              />
              <XAxis dataKey={xAxisKey} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              {series.length > 1 && <Legend />}
              {series.map((s, i) => (
                <Line
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={
                    s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                  }
                  strokeWidth={2}
                  dot={{
                    fill:
                      s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                    r: 3,
                  }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-default, #e2e8f0)"
                vertical={false}
              />
              <XAxis dataKey={xAxisKey} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              {series.length > 1 && <Legend />}
              {series.map((s, i) => {
                const color =
                  s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length];
                return (
                  <Area
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
      case "donut":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                dataKey={valueKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={height * 0.35}
                innerRadius={chartType === "donut" ? height * 0.2 : 0}
                paddingAngle={2}
                label={(props: { name?: string; percent?: number }) => {
                  const name = props?.name ?? "";
                  const percent = props?.percent
                    ? ` ${(props.percent * 100).toFixed(0)}%`
                    : "";
                  return `${name}${percent}`;
                }}
                labelLine={{ strokeWidth: 1 }}
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case "radar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={height * 0.3}
            >
              <PolarGrid stroke="var(--color-border-default, #e2e8f0)" />
              <PolarAngleAxis dataKey={nameKey || xAxisKey} fontSize={11} />
              <PolarRadiusAxis fontSize={10} />
              {series.map((s, i) => (
                <Radar
                  key={s.dataKey}
                  name={s.name}
                  dataKey={s.dataKey}
                  stroke={
                    s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                  }
                  fill={s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              ))}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );

      case "funnel":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey={valueKey}
                nameKey={nameKey}
                data={data}
                isAnimationActive
              >
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
                  />
                ))}
                <LabelList
                  position="center"
                  fill="#ffffff"
                  fontSize={12}
                  fontWeight={600}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      case "composed":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-default, #e2e8f0)"
                vertical={false}
              />
              <XAxis dataKey={xAxisKey} {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {series.map((s, i) => {
                const color =
                  s.color || FALLBACK_COLORS[i % FALLBACK_COLORS.length];
                const seriesType = s.type || (i === 0 ? "bar" : "line");
                if (seriesType === "bar")
                  return (
                    <Bar
                      key={s.dataKey}
                      dataKey={s.dataKey}
                      name={s.name}
                      fill={color}
                      radius={[4, 4, 0, 0]}
                    />
                  );
                if (seriesType === "area")
                  return (
                    <Area
                      key={s.dataKey}
                      type="monotone"
                      dataKey={s.dataKey}
                      name={s.name}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.15}
                    />
                  );
                return (
                  <Line
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return <NoDataPlaceholder height={height} />;
    }
  };

  return (
    <div className={styles.card}>
      {/* Card Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        <div className={styles.actionsWrap}>
          {actions}
          <ChartTypePicker
            value={chartType}
            onChange={setChartType}
            options={
              allowedChartTypes
                ? allowedChartTypes.map((t: ChartType) => ({
                    type: t,
                    label: t
                      .split("-")
                      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" "),
                    icon:
                      ((
                        {
                          bar: "📊",
                          line: "📈",
                          area: "📉",
                          pie: "🥧",
                          donut: "🍩",
                          "stacked-bar": "📶",
                          radar: "🎯",
                          funnel: "🔻",
                          composed: "📊",
                        } as Record<string, string>
                      )[t] || "📊"),
                  }))
                : undefined
            }
          />
        </div>
      </div>

      {/* Chart Area */}
      {renderChart()}
    </div>
  );
};
