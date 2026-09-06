import type { Meta, StoryObj } from "@storybook/react";
import { TeamGrid } from "./team-grid";

const meta: Meta<typeof TeamGrid> = {
  title: "Blocks/TeamGrid",
  component: TeamGrid,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof TeamGrid>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <TeamGrid members={[{ name: 'Sarah Chen', role: 'CEO', initials: 'SC' }, { name: 'James Park', role: 'CTO', initials: 'JP' }, { name: 'Maria Garcia', role: 'VP Engineering', initials: 'MG' }, { name: 'David Kim', role: 'Head of Design', initials: 'DK' }]} />
    </div>
  ),
};
