import type { Meta, StoryObj } from "@storybook/react";
import { NumberStepper } from "./number-stepper";

const meta: Meta<typeof NumberStepper> = {
  title: "Inputs/NumberStepper",
  component: NumberStepper,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof NumberStepper>;

export const Default: Story = {
  args: {
    label: "Batch Size",
    defaultValue: 10,
    min: 1,
    max: 100,
    step: 1,
  },
};

export const Small: Story = {
  args: {
    label: "Items Count",
    defaultValue: 5,
    size: "sm",
    min: 0,
    max: 20,
  },
};

export const LargeWithPrecision: Story = {
  args: {
    label: "Reorder Margin (%)",
    defaultValue: 2.5,
    size: "lg",
    step: 0.5,
    precision: 1,
    min: 0,
    max: 10,
  },
};

export const Disabled: Story = {
  args: {
    label: "Locked Stock Allocation",
    defaultValue: 50,
    disabled: true,
  },
};
