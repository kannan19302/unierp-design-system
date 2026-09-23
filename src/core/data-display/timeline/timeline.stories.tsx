import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "Core/DataDisplay/Timeline",
  component: Timeline,
  tags: ["autodocs"],
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
        <h4 style={{ marginBottom: "8px" }}>Complete and Current States</h4>
        <Timeline
          items={[
            { id: "1", title: "Signed", timestamp: "Yesterday", status: "complete" },
            { id: "2", title: "Reviewing", timestamp: "Today", status: "current" },
            { id: "3", title: "Pending Execution", timestamp: "Tomorrow", status: "pending" },
          ]}
        />
      </div>
      <div>
        <h4 style={{ marginBottom: "8px" }}>Danger State</h4>
        <Timeline
          items={[
            { id: "1", title: "Attempt Failed", timestamp: "12:00", status: "danger" },
          ]}
        />
      </div>
    </div>
  ),
};

