import type { Meta, StoryObj } from "@storybook/react";
import { ActivityFeed, type ActivityItem } from "./activity-feed";

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

const meta: Meta<typeof ActivityFeed> = {
  title: "Core/Dashboard/ActivityFeed",
  component: ActivityFeed,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const Default: Story = {
  args: {
    items: sampleActivities,
    title: "Audit Trail & System Events",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ActivityFeed
        items={[
          {
            id: "single-act",
            actor: { id: "u4", name: "Elena Rostova" },
            action: "EXPORT",
            entityType: "TaxReport",
            entityId: "TR-2026-Q1",
            summary: "Exported Form 1099-MISC summary report to CSV.",
            timestamp: "Just now",
          },
        ]}
        title="Recent Export Operations"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 640, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Active Audit Stream with Diff View
        </h4>
        <ActivityFeed items={sampleActivities} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Empty State
        </h4>
        <ActivityFeed items={[]} emptyMessage="No unverified audit events detected for current fiscal period." />
      </div>
    </div>
  ),
};
