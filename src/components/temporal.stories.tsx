import type { Meta, StoryObj } from "@storybook/react";
import {
  TimePicker,
  DateTimePicker,
  Calendar,
  Scheduler,
  FiscalPeriodPicker,
} from "./temporal";

const meta: Meta = {
  title: "Components/Temporal",
};

export default meta;

export const TimePickerDefault: StoryObj = {
  render: () => <TimePicker value="09:00" />,
};

export const DateTimePickerDefault: StoryObj = {
  render: () => <DateTimePicker value="2026-08-08T09:00" />,
};

export const CalendarDefault: StoryObj = {
  render: () => <Calendar selectedDate={new Date()} />,
};

export const SchedulerDefault: StoryObj = {
  render: () => (
    <Scheduler
      events={[
        { id: "1", title: "Team Sync", start: "09:00", end: "10:00" },
      ]}
    />
  ),
};

export const FiscalPeriodPickerDefault: StoryObj = {
  render: () => <FiscalPeriodPicker fiscalYear={2026} fiscalYearStartMonth={4} />,
};
