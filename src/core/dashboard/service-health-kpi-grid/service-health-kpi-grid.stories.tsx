import type { Meta, StoryObj } from "@storybook/react";
import {
  ServiceHealthKpiGrid,
  type ServiceHealthKpiItem,
} from "./service-health-kpi-grid";

const meta: Meta<typeof ServiceHealthKpiGrid> = {
  title: "Core/Dashboard/ServiceHealthKpiGrid",
  component: ServiceHealthKpiGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServiceHealthKpiGrid>;

const HEALTHY_METRICS: ServiceHealthKpiItem[] = [
  {
    id: "uptime",
    title: "System Availability",
    value: "99.99%",
    target: "SLA: > 99.95%",
    status: "healthy",
    change: "+0.02%",
    changeType: "positive",
    progressPercent: 99.99,
    subtitle: "30-day window",
  },
  {
    id: "latency",
    title: "P95 Request Latency",
    value: "38.2ms",
    target: "Target: < 50ms",
    status: "healthy",
    change: "-4.1ms",
    changeType: "positive",
    progressPercent: 76,
    subtitle: "API Gateway",
  },
  {
    id: "error_rate",
    title: "HTTP Error Rate",
    value: "0.003%",
    target: "Threshold: < 0.1%",
    status: "healthy",
    change: "0.00%",
    changeType: "neutral",
    progressPercent: 3,
    subtitle: "4xx & 5xx responses",
  },
  {
    id: "throughput",
    title: "Throughput (RPS)",
    value: "14,850",
    target: "Capacity: 50k",
    status: "healthy",
    change: "+12.4%",
    changeType: "positive",
    progressPercent: 29.7,
    subtitle: "Current peak",
  },
  {
    id: "pods",
    title: "Healthy Replicas",
    value: "24 / 24",
    target: "Min: 8",
    status: "healthy",
    progressPercent: 100,
    subtitle: "All pods ready",
  },
];

export const Default: Story = {
  args: {
    metrics: HEALTHY_METRICS,
  },
};

export const DegradedState: Story = {
  args: {
    metrics: [
      HEALTHY_METRICS[0],
      {
        id: "latency-deg",
        title: "P95 Request Latency",
        value: "84.7ms",
        target: "Target: < 50ms (BREACH)",
        status: "critical",
        change: "+32.1ms",
        changeType: "negative",
        progressPercent: 95,
        subtitle: "Database connection pool saturated",
      },
      {
        id: "error-deg",
        title: "HTTP Error Rate",
        value: "0.42%",
        target: "Threshold: < 0.1%",
        status: "warning",
        change: "+0.38%",
        changeType: "negative",
        progressPercent: 42,
        subtitle: "Transient timeout spike",
      },
      HEALTHY_METRICS[3],
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>ServiceHealthKpiGrid Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Container Header (Dashboard category headline)</li>
          <li>KPI Metric Cards (Title + health indicator dot e.g. green/amber/red)</li>
          <li>High-Density Primary Value (Large bold monospace figure + delta trend badge)</li>
          <li>Colored Progress Track (Visual capacity / threshold fill percentage)</li>
          <li>SLA Target & Subtitle Footer</li>
        </ol>
      </div>
      <ServiceHealthKpiGrid metrics={HEALTHY_METRICS} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>All Services Healthy</h4>
        <ServiceHealthKpiGrid metrics={HEALTHY_METRICS} />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Critical SLA Alert</h4>
        <ServiceHealthKpiGrid
          metrics={[
            {
              id: "m1",
              title: "Cluster Uptime",
              value: "98.2%",
              target: "SLA: 99.9%",
              status: "critical",
              progressPercent: 98.2,
              subtitle: "Degraded cluster",
            },
            {
              id: "m2",
              title: "Memory Pressure",
              value: "88%",
              target: "Alert at 85%",
              status: "warning",
              progressPercent: 88,
              subtitle: "High utilization",
            },
          ]}
        />
      </div>
    </div>
  ),
};
