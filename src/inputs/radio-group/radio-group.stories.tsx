import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "Inputs/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    value: "fifo",
    options: [
      { value: "fifo", label: "FIFO (First In, First Out)", hint: "Standard cost valuation" },
      { value: "lifo", label: "LIFO (Last In, First Out)", hint: "Tax optimization in US GAAP" },
      { value: "wac", label: "Weighted Average Cost", hint: "Continuous moving average" },
    ],
  },
};

export const Horizontal: Story = {
  args: {
    value: "daily",
    orientation: "horizontal",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" },
    ],
  },
};
