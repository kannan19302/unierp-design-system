import type { Meta, StoryObj } from "@storybook/react";
import { SlaPerformanceGauge, type SlaMilestone } from "./sla-performance-gauge";

const mockMilestones: SlaMilestone[] = [
  {
    id: "sla-1",
    name: "First Response Target (< 15 mins)",
    type: "first_response",
    targetMinutes: 15,
    elapsedMinutes: 8,
    status: "achieved",
  },
  {
    id: "sla-2",
    name: "Workaround & Mitigation SLA (< 60 mins)",
    type: "workaround",
    targetMinutes: 60,
    elapsedMinutes: 42,
    status: "warning",
    penaltyAmount: 1500,
  },
  {
    id: "sla-3",
    name: "Full Root-Cause Incident Resolution (< 4 hours)",
    type: "resolution",
    targetMinutes: 240,
    elapsedMinutes: 42,
    status: "on_track",
    penaltyAmount: 5000,
  },
];

const meta: Meta<typeof SlaPerformanceGauge> = {
  title: "DataDisplay/SlaPerformanceGauge",
  component: SlaPerformanceGauge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SlaPerformanceGauge>;

export const Default: Story = {
  args: {
    ticketRef: "INC-88912",
    commitmentTier: "Mission-Critical Tier 1 (99.99% Availability SLA)",
    milestones: mockMilestones,
    isBusinessHoursOnly: true,
  },
};

export const Breached: Story = {
  args: {
    ticketRef: "INC-88990",
    commitmentTier: "Platinum SLA 24/7",
    milestones: [
      {
        id: "sla-1",
        name: "First Response Target (< 15 mins)",
        type: "first_response",
        targetMinutes: 15,
        elapsedMinutes: 45,
        status: "breached",
        penaltyAmount: 2500,
      },
    ],
  },
};
