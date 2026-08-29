import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./date-picker";

const meta: Meta<typeof DatePicker> = {
  title: "Inputs/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
  args: {
    value: "2026-08-29",
  },
};

export const RestrictedRange: Story = {
  args: {
    minDate: "2026-01-01",
    maxDate: "2026-12-31",
    value: "2026-06-15",
  },
};
