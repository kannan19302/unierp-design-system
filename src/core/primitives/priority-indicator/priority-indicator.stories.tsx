import type { Meta, StoryObj } from "@storybook/react";
import { PriorityIndicator } from "./priority-indicator";

const meta: Meta<typeof PriorityIndicator> = {
  title: "Primitives/PriorityIndicator",
  component: PriorityIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "High-contrast operational priority and triage badge for tickets, approvals, audit findings, and service escalations. Supports urgent, high, medium, and low urgency tiers.",
      },
    },
  },
  argTypes: {
    priority: {
      control: "select",
      options: ["low", "medium", "high", "urgent"],
      description: "Urgency and escalation level.",
      table: {
        type: { summary: "low | medium | high | urgent" },
        defaultValue: { summary: "medium" },
      },
    },
    variant: {
      control: "radio",
      options: ["text", "pill"],
      description: "Visual container format.",
      table: {
        type: { summary: "text | pill" },
        defaultValue: { summary: "text" },
      },
    },
    showLabel: {
      control: "boolean",
      description: "Renders textual priority name adjacent to icon.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriorityIndicator>;

export const Low: Story = {
  args: { priority: "low", showLabel: true },
};

export const Medium: Story = {
  args: { priority: "medium", showLabel: true },
};

export const High: Story = {
  args: { priority: "high", showLabel: true },
};

export const Urgent: Story = {
  args: { priority: "urgent", showLabel: true },
};

export const PillMatrix = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
    <PriorityIndicator priority="urgent" variant="pill" showLabel />
    <PriorityIndicator priority="high" variant="pill" showLabel />
    <PriorityIndicator priority="medium" variant="pill" showLabel />
    <PriorityIndicator priority="low" variant="pill" showLabel />
  </div>
);

export const TextMatrix = () => (
  <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
    <PriorityIndicator priority="urgent" variant="text" showLabel />
    <PriorityIndicator priority="high" variant="text" showLabel />
    <PriorityIndicator priority="medium" variant="text" showLabel />
    <PriorityIndicator priority="low" variant="text" showLabel />
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Severity Glyph + Textual Priority Title + Pill Enclosure
    </div>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <PriorityIndicator priority="urgent" variant="pill" showLabel />
      <PriorityIndicator priority="medium" variant="text" showLabel />
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
    {/* Row 1: Pill Capsule Variants */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Capsule Pill Tiers (Urgent, High, Medium, Low)
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
        <PriorityIndicator priority="urgent" variant="pill" showLabel />
        <PriorityIndicator priority="high" variant="pill" showLabel />
        <PriorityIndicator priority="medium" variant="pill" showLabel />
        <PriorityIndicator priority="low" variant="pill" showLabel />
      </div>
    </div>

    {/* Row 2: Inset Text Format */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Inline Text Format for High-Density Grids
      </div>
      <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}>
        <PriorityIndicator priority="urgent" variant="text" showLabel />
        <PriorityIndicator priority="high" variant="text" showLabel />
        <PriorityIndicator priority="medium" variant="text" showLabel />
        <PriorityIndicator priority="low" variant="text" showLabel />
      </div>
    </div>
  </div>
);

