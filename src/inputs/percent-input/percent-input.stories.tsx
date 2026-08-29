import type { Meta, StoryObj } from "@storybook/react";
import { PercentInput } from "./percent-input";

const meta: Meta<typeof PercentInput> = {
  title: "Inputs/PercentInput",
  component: PercentInput,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof PercentInput>;

export const Default: Story = {
  args: {
    value: 18.5,
    placeholder: "0.0",
  },
};

export const ClampedRange: Story = {
  args: {
    min: 0,
    max: 100,
    value: 75,
  },
};
