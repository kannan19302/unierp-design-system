import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Quarter: Story = {
  args: {
    value: 25,
    max: 100,
    label: "Quarter complete",
    showValue: true,
  },
};

export const HalfSuccess: Story = {
  args: {
    value: 50,
    max: 100,
    variant: "success",
    label: "Sync Status",
    showValue: true,
  },
};

export const DangerWarning: Story = {
  args: {
    value: 92,
    max: 100,
    variant: "danger",
    label: "Memory Capacity",
    showValue: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Processing batch...",
    variant: "primary",
  },
};

export const SizesAndTonesMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", maxWidth: 500 }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
        All Sizing Tiers (xs, sm, md, lg)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Progress value={45} size="xs" label="Micro (xs: 4px)" showValue />
        <Progress value={60} size="sm" label="Compact (sm: 6px)" showValue />
        <Progress value={75} size="md" label="Default (md: 8px)" showValue />
        <Progress value={90} size="lg" label="Spacious (lg: 12px)" showValue />
      </div>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
        All Tone Semantics
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <Progress value={70} variant="primary" label="Primary (accent)" showValue />
        <Progress value={100} variant="success" label="Success (completed)" showValue />
        <Progress value={65} variant="warning" label="Warning (threshold)" showValue />
        <Progress value={95} variant="danger" label="Danger (critical)" showValue />
        <Progress value={40} variant="neutral" label="Neutral (pending)" showValue />
      </div>
    </div>
  </div>
);
