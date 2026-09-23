import type { Meta, StoryObj } from "@storybook/react";
import {
  OnCallRotationScheduleCalendar,
  type EscalationLayer,
  type OnCallShift,
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
    title: "Platforms/DeveloperPlatform/Observability/OnCallRotationScheduleCalendar",
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
  title: "Platforms/DeveloperPlatform/Observability/OnCallRotationScheduleCalendar",
  component: OnCallRotationScheduleCalendar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
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

export const Comfortable: Story = {
  args: {
    ...Default.args,
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>On-Call Rotation Schedule Matrix</h4>
        <OnCallRotationScheduleCalendar
          scheduleName="Platform SRE & Infrastructure Tier-1 Rotation"
          weekRange="Sep 14, 2026 – Sep 20, 2026"
          days={sampleDays}
          layers={sampleLayers}
          shifts={sampleShifts}
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Weekly Schedule (Compact Density)</h4>
        <OnCallRotationScheduleCalendar
          scheduleName="Platform SRE & Infrastructure Tier-1 Rotation"
          weekRange="Sep 14, 2026 – Sep 20, 2026"
          days={sampleDays}
          layers={sampleLayers}
          shifts={sampleShifts}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Comfortable Density View</h4>
        <OnCallRotationScheduleCalendar
          scheduleName="Platform SRE & Infrastructure Tier-1 Rotation"
          weekRange="Sep 14, 2026 – Sep 20, 2026"
          days={sampleDays}
          layers={sampleLayers}
          shifts={sampleShifts}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
