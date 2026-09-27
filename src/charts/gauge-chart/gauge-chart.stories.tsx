import type { Meta, StoryObj } from "@storybook/react";
import { SlaPerformanceGauge, type SlaMilestone } from "./gauge-chart";

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
  title: "Charts/SlaPerformanceGauge",
  component: SlaPerformanceGauge,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling mode",
    },
  },
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

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density}>
          <h5 style={{ marginBlockEnd: "var(--space-2)", textTransform: "capitalize" }}>
            Density: {density}
          </h5>
          <SlaPerformanceGauge
            density={density}
            ticketRef="INC-88912"
            commitmentTier={`Mission-Critical Tier 1 (${density})`}
            milestones={mockMilestones}
          />
        </div>
      ))}
    </div>
  ),
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

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <SlaPerformanceGauge {...args} />
    </div>
  ),
  args: {
    ticketRef: "INC-88912",
    commitmentTier: "Mission-Critical Tier 1 (99.99% Availability SLA)",
    milestones: mockMilestones,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>On-Track State</h4>
        <SlaPerformanceGauge
          ticketRef="INC-88912"
          commitmentTier="Mission-Critical Tier 1"
          milestones={mockMilestones}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Breached State</h4>
        <SlaPerformanceGauge
          ticketRef="INC-88990"
          commitmentTier="Platinum SLA 24/7"
          milestones={[
            {
              id: "sla-1",
              name: "First Response Target (< 15 mins)",
              type: "first_response",
              targetMinutes: 15,
              elapsedMinutes: 45,
              status: "breached",
              penaltyAmount: 2500,
            },
          ]}
        />
      </div>
    </div>
  ),
};
