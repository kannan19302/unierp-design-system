import type { Meta, StoryObj } from "@storybook/react";
import { Presence } from "./presence";

const meta: Meta<typeof Presence> = {
  title: "Primitives/Presence",
  component: Presence,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "select",
      options: ["online", "offline", "busy", "away"],
    },
    showLabel: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Presence>;

export const Online: Story = {
  args: { status: "online", showLabel: true },
};

export const Busy: Story = {
  args: { status: "busy", showLabel: true },
};

export const Away: Story = {
  args: { status: "away", showLabel: true },
};

export const DotVariant: Story = {
  args: { status: "online", variant: "dot", size: "md", showLabel: true },
};

export const PulsingRadarDot: Story = {
  args: { status: "online", variant: "dot", pulse: true, size: "lg", showLabel: true },
};

export const StatusPills = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
    <Presence status="online" variant="pill" pulse />
    <Presence status="busy" variant="pill" />
    <Presence status="away" variant="pill" />
    <Presence status="offline" variant="pill" />
  </div>
);

export const StandaloneDots = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Presence status="online" variant="dot" size="sm" />
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Small (6px)</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Presence status="online" variant="dot" size="md" pulse />
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Medium Radar (8px)</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Presence status="busy" variant="dot" size="lg" pulse />
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Large Radar (10px)</span>
    </div>
  </div>
);

