import type { Meta, StoryObj } from "@storybook/react";
import {
  CanaryRolloutProgressVisualizer,
  CanaryMetricComparison,
} from "./canary-rollout-progress-visualizer";

const mockMetrics: CanaryMetricComparison[] = [
  {
    name: "HTTP 5xx Error Rate",
    unit: "%",
    baselineValue: 0.01,
    canaryValue: 0.02,
    maxThreshold: 0.5,
    status: "pass",
  },
  {
    name: "P99 Response Latency",
    unit: "ms",
    baselineValue: 38,
    canaryValue: 44,
    maxThreshold: 100,
    status: "pass",
  },
  {
    name: "JVM Garbage Collection Pause",
    unit: "ms",
    baselineValue: 12,
    canaryValue: 14,
    maxThreshold: 45,
    status: "pass",
  },
  {
    name: "Database Connection Pool Saturation",
    unit: "%",
    baselineValue: 22,
    canaryValue: 28,
    maxThreshold: 75,
    status: "pass",
  },
];

const meta: Meta<typeof CanaryRolloutProgressVisualizer> = {
  title: "Workflow/CanaryRolloutProgressVisualizer",
  component: CanaryRolloutProgressVisualizer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CanaryRolloutProgressVisualizer>;

export const Default: Story = {
  args: {
    serviceName: "payments-orchestration-engine",
    clusterNamespace: "prod-us-east-1 / core-services",
    stableVersion: "v2.13.8",
    canaryVersion: "v2.14.0-canary.4",
    currentTrafficPercent: 25,
    currentStep: 2,
    totalSteps: 4,
    stepDurationSeconds: 900,
    stepElapsedSeconds: 480,
    status: "analyzing",
    metrics: mockMetrics,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const Aborted: Story = {
  args: {
    ...Default.args,
    status: "aborted",
    currentTrafficPercent: 0,
    metrics: mockMetrics.map((m, idx) =>
      idx === 0
        ? { ...m, canaryValue: 1.45, status: "fail" }
        : m
    ),
  },
};
