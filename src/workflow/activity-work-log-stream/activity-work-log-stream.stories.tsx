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
  title: "Workflow/ActivityWorkLogStream",
  component: ActivityWorkLogStream,
  parameters: {
    layout: "padded",
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
