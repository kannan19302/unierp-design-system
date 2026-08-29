import type { Meta, StoryObj } from "@storybook/react";
import { CurrencyInput } from "./currency-input";

const meta: Meta<typeof CurrencyInput> = {
  title: "Inputs/CurrencyInput",
  component: CurrencyInput,
  tags: ["autodocs"],
  argTypes: {
    currencySymbol: { control: "text" },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  args: {
    currencySymbol: "$",
    placeholder: "0.00",
    value: 1250.5,
  },
};

export const Euro: Story = {
  args: {
    currencySymbol: "€",
    value: 8400.0,
  },
};

export const InvalidState: Story = {
  args: {
    currencySymbol: "$",
    value: -100,
    invalid: true,
  },
};
