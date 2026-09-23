import type { Meta, StoryObj } from "@storybook/react";
import { ChangelogTimeline } from "./changelog-timeline";

const SAMPLE_ENTRIES = [
  {
    version: "v3.2.0",
    date: "Sep 6, 2026",
    changes: [
      { type: "feat" as const, text: "Added AI Copilot for invoice drafting" },
      { type: "feat" as const, text: "New real-time dashboard widgets" },
      { type: "fix" as const, text: "Fixed currency rounding in multi-currency ledger" },
    ],
  },
  {
    version: "v3.1.0",
    date: "Aug 29, 2026",
    changes: [
      { type: "feat" as const, text: "Bulk payment approval workflow" },
      { type: "breaking" as const, text: "Removed legacy v1 API endpoints" },
    ],
  },
];

const meta: Meta<typeof ChangelogTimeline> = {
  title: "Core/Feedback/ChangelogTimeline",
  component: ChangelogTimeline,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChangelogTimeline>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ChangelogTimeline entries={SAMPLE_ENTRIES} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ChangelogTimeline
        entries={[
          {
            version: "v4.0.0-rc1",
            date: "Sep 18, 2026",
            changes: [
              { type: "breaking", text: "Mandatory PostgreSQL Row-Level Security (RLS)" },
              { type: "feat", text: "Zero-latency Kafka event streaming pipeline" },
              { type: "fix", text: "Memory leak patch in heavy data grid virtualizer" },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ChangelogTimeline entries={SAMPLE_ENTRIES} />
    </div>
  ),
};
