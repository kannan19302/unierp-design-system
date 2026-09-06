import type { Meta, StoryObj } from "@storybook/react";
import { ChangelogTimeline } from "./changelog-timeline";

const meta: Meta<typeof ChangelogTimeline> = {
  title: "Notifications/ChangelogTimeline",
  component: ChangelogTimeline,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ChangelogTimeline>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ChangelogTimeline entries={[{ version: 'v3.2.0', date: 'Sep 6, 2026', changes: [{ type: 'feat', text: 'Added AI Copilot for invoice drafting' }, { type: 'feat', text: 'New real-time dashboard widgets' }, { type: 'fix', text: 'Fixed currency rounding in multi-currency ledger' }] }, { version: 'v3.1.0', date: 'Aug 29, 2026', changes: [{ type: 'feat', text: 'Bulk payment approval workflow' }, { type: 'breaking', text: 'Removed legacy v1 API endpoints' }] }]} />
    </div>
  ),
};
