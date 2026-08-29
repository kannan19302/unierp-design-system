import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput } from "./number-input";

const meta: Meta<typeof NumberInput> = {
  title: "Inputs/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
    value: 42,
    placeholder: "0",
  },
};

export const QuantityPicker: Story = {
  args: {
    min: 1,
    max: 1000,
    step: 5,
    value: 25,
  },
};
