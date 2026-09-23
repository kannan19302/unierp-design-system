import type { Meta, StoryObj } from "@storybook/react";
import { BillableTimeStopwatchDock } from "./billable-time-stopwatch-dock";

const meta: Meta<typeof BillableTimeStopwatchDock> = {
  title: "Platforms/BusinessSuite/LegalOps/BillableTimeStopwatchDock",
  component: BillableTimeStopwatchDock,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BillableTimeStopwatchDock>;

const mockMatters = [
  {
    id: "m-1",
    clientName: "Stripe Global Inc.",
    matterCode: "MAT-2026-904",
    matterTitle: "Commercial Series D Financing & Debt Facility",
    defaultHourlyRate: 750,
  },
  {
    id: "m-2",
    clientName: "Brex Treasury Corp.",
    matterCode: "MAT-2026-412",
    matterTitle: "Cross-Border Tax Advisory & IP Licensing",
    defaultHourlyRate: 650,
  },
  {
    id: "m-3",
    clientName: "Anthropic PBC",
    matterCode: "MAT-2026-118",
    matterTitle: "Enterprise Model Safety Governance & Risk Audit",
    defaultHourlyRate: 900,
  },
];

export const Default: Story = {
  args: {
    matters: mockMatters,
    initialMatterId: "m-1",
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    matters: mockMatters,
    initialMatterId: "m-2",
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    matters: mockMatters,
    initialMatterId: "m-3",
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    matters: mockMatters,
    initialMatterId: "m-1",
    density: "standard",
  },
  render: (args) => (
    <div style={{ inlineSize: "100%", maxInlineSize: "640px" }}>
      <BillableTimeStopwatchDock {...args} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact Density</h4>
        <BillableTimeStopwatchDock matters={mockMatters} initialMatterId="m-1" density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Standard Density</h4>
        <BillableTimeStopwatchDock matters={mockMatters} initialMatterId="m-2" density="standard" />
      </div>
    </div>
  ),
};
