import type { Meta, StoryObj } from "@storybook/react";
import { DateTimePicker } from "./date-time-picker";
import { TimePicker } from "./time-picker";

const meta: Meta<typeof DateTimePicker> = {
  title: "Inputs/DateTimePicker",
  component: DateTimePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

export const Default: Story = {
  args: {
    value: "2026-08-29T14:30",
  },
};

export const TimeOnly = () => (
  <div style={{ width: 180 }}>
    <TimePicker value="16:45" />
  </div>
);
