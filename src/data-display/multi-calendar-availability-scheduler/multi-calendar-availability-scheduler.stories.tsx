import type { Meta, StoryObj } from "@storybook/react";
import {
  MultiCalendarAvailabilityScheduler,
  CalendarResource,
  ScheduledBooking,
} from "./multi-calendar-availability-scheduler";

const sampleResources: CalendarResource[] = [
  {
    id: "res-1",
    name: "Elena Rostova",
    role: "Principal Enterprise Architect",
    type: "person",
  },
  {
    id: "res-2",
    name: "Marcus Vance",
    role: "VP of Cloud & Infrastructure",
    type: "person",
  },
  {
    id: "res-3",
    name: "Conf Room 402 (Telepresence)",
    role: "16-Person Boardroom (Dual 85\" Displays)",
    type: "room",
  },
  {
    id: "res-4",
    name: "Dr. Sarah Chen",
    role: "Head of AI Research",
    type: "person",
  },
];

const sampleBookings: ScheduledBooking[] = [
  {
    id: "b-1",
    resourceId: "res-1",
    title: "Strata DL 2.0 Design Review",
    startTime: "09:00",
    endTime: "10:30",
  },
  {
    id: "b-2",
    resourceId: "res-3",
    title: "Strata DL 2.0 Design Review",
    startTime: "09:00",
    endTime: "10:30",
  },
  {
    id: "b-3",
    resourceId: "res-2",
    title: "Executive Q3 CapEx Sync",
    startTime: "11:00",
    endTime: "12:00",
  },
  {
    id: "b-4",
    resourceId: "res-2",
    title: "AWS Partnership Discussion",
    startTime: "11:00",
    endTime: "12:00",
    isConflict: true,
  },
  {
    id: "b-5",
    resourceId: "res-4",
    title: "Agentic Evaluation Calibration",
    startTime: "14:00",
    endTime: "15:30",
  },
];

const meta: Meta<typeof MultiCalendarAvailabilityScheduler> = {
  title: "Data Display/MultiCalendarAvailabilityScheduler",
  component: MultiCalendarAvailabilityScheduler,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultiCalendarAvailabilityScheduler>;

export const Default: Story = {
  args: {
    selectedDate: "2026-09-15",
    resources: sampleResources,
    bookings: sampleBookings,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
