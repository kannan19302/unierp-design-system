import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "COMPONENTS/Progress",
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
