import type { Meta, StoryObj } from "@storybook/react";
import {
  OnCallRotationScheduleCalendar,
  EscalationLayer,
  OnCallShift,
} from "./on-call-rotation-schedule-calendar";

const sampleDays = [
  "Mon 9/14",
  "Tue 9/15",
  "Wed 9/16",
  "Thu 9/17",
  "Fri 9/18",
  "Sat 9/19",
  "Sun 9/20",
];

const sampleLayers: EscalationLayer[] = [
  {
    tier: "tier_1_primary",
    title: "Tier 1: Primary On-Call",
    escalationTimeoutMinutes: 5,
  },
  {
    tier: "tier_2_secondary",
    title: "Tier 2: Secondary Escalation",
    escalationTimeoutMinutes: 15,
  },
  {
    tier: "escalation_lead",
    title: "SRE Duty Incident Commander",
    escalationTimeoutMinutes: 30,
  },
];

const sampleShifts: OnCallShift[] = [
  {
    id: "shift-t1-mon",
    tier: "tier_1_primary",
    engineerName: "Elena Rostova",
    engineerEmail: "elena.rostova@unierp.internal",
    dayLabel: "Mon 9/14",
    startTime: "09:00 UTC",
    endTime: "09:00 UTC (+1d)",
    handoffNotes: "Kafka partition rebalance executed cleanly on prod-cluster-02.",
  },
  {
    id: "shift-t1-tue",
    tier: "tier_1_primary",
    engineerName: "Marcus Vance",
    engineerEmail: "marcus.vance@unierp.internal",
    dayLabel: "Tue 9/15",
    startTime: "09:00 UTC",
    endTime: "09:00 UTC (+1d)",
    isOverride: true,
    originalEngineer: "Elena Rostova",
    handoffNotes: "Scheduled maintenance swap for cluster kernel patching.",
  },
  {
    id: "shift-t2-mon",
    tier: "tier_2_secondary",
    engineerName: "Alex Rivera",
    engineerEmail: "alex.rivera@unierp.internal",
    dayLabel: "Mon 9/14",
    startTime: "09:00 UTC",
    endTime: "09:00 UTC (+1d)",
  },
  {
    id: "shift-lead-mon",
    tier: "escalation_lead",
    engineerName: "Dr. Sarah Chen",
    engineerEmail: "sarah.chen@unierp.internal",
    dayLabel: "Mon 9/14",
    startTime: "09:00 UTC",
    endTime: "09:00 UTC (+1d)",
  },
];

const meta: Meta<typeof OnCallRotationScheduleCalendar> = {
  title: "Workflow/OnCallRotationScheduleCalendar",
  component: OnCallRotationScheduleCalendar,
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
type Story = StoryObj<typeof OnCallRotationScheduleCalendar>;

export const Default: Story = {
  args: {
    scheduleName: "Platform SRE & Infrastructure Tier-1 Rotation",
    weekRange: "Sep 14, 2026 – Sep 20, 2026",
    days: sampleDays,
    layers: sampleLayers,
    shifts: sampleShifts,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
