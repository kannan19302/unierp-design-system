import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "Compositions/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata DL 4-tier density scaling",
    },
    items: {
      control: "object",
      description: "Array of chronological timeline events and audit records",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const AuditHistory: Story = {
  args: {
    items: [
      {
        id: "1",
        title: "Voucher Posted to General Ledger",
        timestamp: "2026-08-29 10:45:02 UTC",
        description: "Committed by CFO (kannan@enterprise.org) with cryptographic signature.",
        status: "complete",
      },
      {
        id: "2",
        title: "Two-Man Rule Verification Approved",
        timestamp: "2026-08-29 09:30:15 UTC",
        description: "Controller signed off on invoice batch #4819.",
        status: "complete",
      },
      {
        id: "3",
        title: "Automated Fraud Detection Flagged",
        timestamp: "2026-08-29 08:12:00 UTC",
        description: "Split payment threshold warning cleared by compliance officer.",
        status: "danger",
      },
      {
        id: "4",
        title: "Draft Created from Purchase Order",
        timestamp: "2026-08-29 07:00:10 UTC",
        description: "Imported via EDI connector from SAP.",
        status: "pending",
      },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Timeline {...args} />
    </div>
  ),
  args: {
    items: [
      {
        id: "1",
        title: "Event Started",
        timestamp: "09:00",
        status: "complete",
      },
      {
        id: "2",
        title: "In Progress",
        timestamp: "09:30",
        status: "current",
      },
    ],
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBlockEnd: "8px" }}>Complete and Current States</h4>
        <Timeline
          items={[
            { id: "1", title: "Signed", timestamp: "Yesterday", status: "complete" },
            { id: "2", title: "Reviewing", timestamp: "Today", status: "current" },
            { id: "3", title: "Pending Execution", timestamp: "Tomorrow", status: "pending" },
          ]}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "8px" }}>Danger State</h4>
        <Timeline
          items={[
            { id: "1", title: "Attempt Failed", timestamp: "12:00", status: "danger" },
          ]}
        />
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => {
    const sampleItems = [
      { id: "1", title: "Audit Log Committed", timestamp: "10:30 UTC", status: "complete" as const },
      { id: "2", title: "Compliance Review", timestamp: "11:15 UTC", status: "current" as const },
      { id: "3", title: "Ledger Finalization", timestamp: "12:00 UTC", status: "pending" as const },
    ];
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;

    return (
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {densities.map((d) => (
          <div key={d} style={{ display: "grid", gap: "var(--space-2)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Density: {d}
            </div>
            <Timeline density={d} items={sampleItems} />
          </div>
        ))}
      </div>
    );
  },
};

