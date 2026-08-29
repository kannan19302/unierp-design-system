import type { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "DataDisplay/Timeline",
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
