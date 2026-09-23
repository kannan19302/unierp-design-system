import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ActivityWorkLogStream, WorkLogEntry } from "./activity-work-log-stream";

const SAMPLE_ENTRIES: WorkLogEntry[] = [
  {
    id: "entry-1",
    type: "system_audit",
    authorName: "System Engine",
    createdAt: "2026-09-06 07:15:00 UTC",
    content: "Incident INC-8492 auto-created via Datadog High-P99 latency webhook.",
  },
  {
    id: "entry-2",
    type: "internal_note",
    authorName: "Sarah Connor",
    authorRole: "Principal SRE",
    createdAt: "2026-09-06 07:22:15 UTC",
    content: "Identified PostgreSQL deadlocks in subledger write pipeline during shard-4 partition migration. Investigating replica replication lag before customer notification.",
    attachments: [
      { name: "pg_stat_activity_dump.csv", sizeBytes: 42000 },
      { name: "shard4_metrics.png", sizeBytes: 125000 },
    ],
  },
  {
    id: "entry-3",
    type: "customer_reply",
    authorName: "Alex Mercer",
    authorRole: "Customer Success Lead",
    createdAt: "2026-09-06 07:35:00 UTC",
    content: "Hello Global Bank Team, we are currently mitigating intermittent delay in transaction postings for your region. Zero data loss has occurred; batch catch-up is underway.",
  },
];

const meta: Meta<typeof ActivityWorkLogStream> = {
  title: "Core/Workflow/ActivityWorkLogStream",
  component: ActivityWorkLogStream,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActivityWorkLogStream>;

export const Default: Story = {
  args: {
    entries: SAMPLE_ENTRIES,
    currentUser: { name: "Devin Vance" },
    defaultComposerType: "internal_note",
  },
};

export const CustomerReplyFocused: Story = {
  args: {
    entries: SAMPLE_ENTRIES,
    currentUser: { name: "Emily Blunt" },
    defaultComposerType: "customer_reply",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Activity Log</p>
        <ActivityWorkLogStream
          entries={SAMPLE_ENTRIES}
          currentUser={{ name: "Lead Architect" }}
          defaultComposerType="internal_note"
          onSubmitEntry={(e) => console.log("Submit:", e)}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Customer-Visible Communication Stream</p>
        <ActivityWorkLogStream
          entries={SAMPLE_ENTRIES.filter((e) => e.type === "customer_reply")}
          currentUser={{ name: "Customer Advocate" }}
          defaultComposerType="customer_reply"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <ActivityWorkLogStream entries={SAMPLE_ENTRIES} density="compact" />
      <ActivityWorkLogStream entries={SAMPLE_ENTRIES} density="comfortable" />
      <ActivityWorkLogStream entries={[]} density="compact" />
    </div>
  ),
};
