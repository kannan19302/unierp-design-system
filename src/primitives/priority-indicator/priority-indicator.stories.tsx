import type { Meta, StoryObj } from "@storybook/react";
import { PriorityIndicator } from "./priority-indicator";

const meta: Meta<typeof PriorityIndicator> = {
  title: "Primitives/PriorityIndicator",
  component: PriorityIndicator,
  tags: ["autodocs"],
  argTypes: {
    priority: {
      control: "select",
      options: ["low", "medium", "high", "urgent"],
    },
    showLabel: { control: "boolean" },
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

