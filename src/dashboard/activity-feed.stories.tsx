import type { Meta, StoryObj } from "@storybook/react";
import { ActivityFeed, type ActivityItem } from "./activity-feed";

const meta: Meta<typeof ActivityFeed> = {
  title: "Dashboard/ActivityFeed",
  component: ActivityFeed,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

const sampleActivities: ActivityItem[] = [
  {
    id: "act-1",
    actor: { id: "u1", name: "David Sterling", role: "Auditor" },
    action: "UPDATE",
    entityType: "GeneralLedger",
    entityId: "GL-4001",
    summary: "Adjusted tax accrual account from 2100 to 2150",
    timestamp: "10:45 AM",
    diffs: [
      { field: "Account Code", oldValue: "2100 - VAT Payable", newValue: "2150 - Input Tax Credit" },
      { field: "Auto-Reconciliation", oldValue: "Disabled", newValue: "Enabled" },
    ],
  },
  {
    id: "act-2",
    actor: { id: "u2", name: "Sarah Chen", role: "Finance Director" },
    action: "APPROVE",
    entityType: "PurchaseOrder",
    entityId: "PO-8821",
    summary: "Authorized vendor payout to Cloud Services Inc.",
    timestamp: "09:30 AM",
  },
  {
    id: "act-3",
    actor: { id: "u3", name: "System Automation", role: "Cron Job" },
    action: "POST",
    entityType: "JournalEntry",
    entityId: "JE-902",
    summary: "End-of-month foreign exchange translation revaluation batch posted.",
    timestamp: "00:01 AM",
  },
];

export const Default: Story = {
  args: {
    items: sampleActivities,
    title: "Audit Trail & System Events",
  },
};
