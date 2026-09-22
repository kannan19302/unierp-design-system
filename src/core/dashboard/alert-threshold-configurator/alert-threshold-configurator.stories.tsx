import type { Meta, StoryObj } from "@storybook/react";
import { AlertThresholdConfigurator } from "./alert-threshold-configurator";

const meta: Meta<typeof AlertThresholdConfigurator> = {
  title: "Dashboard/AlertThresholdConfigurator",
  component: AlertThresholdConfigurator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof AlertThresholdConfigurator>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 520, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <AlertThresholdConfigurator
        metric="CPU Core Utilization"
        warningThreshold={75}
        criticalThreshold={90}
        unit="%"
        onSave={() => {}}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 520, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <AlertThresholdConfigurator
        metric="Database Connection Pool"
        warningThreshold={150}
        criticalThreshold={190}
        max={200}
        unit=" conns"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 520, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Standard Telemetry Gauge
        </h4>
        <AlertThresholdConfigurator
          metric="API P99 Latency"
          warningThreshold={250}
          criticalThreshold={500}
          max={1000}
          unit="ms"
          onSave={() => {}}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Read-Only / No Save Action
        </h4>
        <AlertThresholdConfigurator
          metric="Disk Volume Fill"
          warningThreshold={80}
          criticalThreshold={95}
          unit="%"
        />
      </div>
    </div>
  ),
};
