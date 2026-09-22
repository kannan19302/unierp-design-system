import type { Meta, StoryObj } from "@storybook/react";
import { ChangelogSection } from "./changelog-section";

const meta: Meta<typeof ChangelogSection> = {
  title: "Blocks/ChangelogSection",
  component: ChangelogSection,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ChangelogSection>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ChangelogSection entries={[{ version: 'v3.2.0', date: 'Sep 2026', title: 'AI Copilot & Dashboard Widgets', items: ['AI-powered invoice drafting', 'New real-time dashboard widgets', 'Improved multi-currency support'] }, { version: 'v3.1.0', date: 'Aug 2026', title: 'Bulk Payment Approvals', items: ['Batch payment workflow', 'Enhanced audit trail'] }]} />
    </div>
  ),
};
