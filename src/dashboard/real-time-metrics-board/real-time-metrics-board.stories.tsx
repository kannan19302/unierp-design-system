import type { Meta, StoryObj } from "@storybook/react";
import { RealTimeMetricsBoard } from "./real-time-metrics-board";

const meta: Meta<typeof RealTimeMetricsBoard> = {
  title: "Dashboard/RealTimeMetricsBoard",
  component: RealTimeMetricsBoard,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof RealTimeMetricsBoard>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <RealTimeMetricsBoard widgets={[{ id: '1', label: 'CPU Usage', value: '67%', status: 'normal' }, { id: '2', label: 'Memory', value: '82%', status: 'warning' }, { id: '3', label: 'Requests/s', value: '1,247', unit: 'req/s' }, { id: '4', label: 'Error Rate', value: '0.12%', status: 'normal' }, { id: '5', label: 'P99 Latency', value: '245', unit: 'ms', status: 'warning' }, { id: '6', label: 'Active Users', value: '3,891' }]} />
    </div>
  ),
};
