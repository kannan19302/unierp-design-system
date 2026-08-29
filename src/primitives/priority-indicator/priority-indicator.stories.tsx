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
