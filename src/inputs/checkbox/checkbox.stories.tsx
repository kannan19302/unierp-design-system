import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    indeterminate: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: "Select all ledger rows",
    defaultChecked: false,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Partially selected entries (14 of 30)",
    indeterminate: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    label: "Mandatory system compliance check",
    checked: true,
    disabled: true,
  },
};
