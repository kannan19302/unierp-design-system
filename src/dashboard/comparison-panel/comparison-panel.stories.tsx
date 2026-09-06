import type { Meta, StoryObj } from "@storybook/react";
import { ComparisonPanel } from "./comparison-panel";

const meta: Meta<typeof ComparisonPanel> = {
  title: "Dashboard/ComparisonPanel",
  component: ComparisonPanel,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ComparisonPanel>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ComparisonPanel items={[{ label: 'Revenue', current: '$1.2M', previous: '$980K', change: 22 }, { label: 'Orders', current: '3,241', previous: '2,890', change: 12 }, { label: 'Avg Ticket', current: '$370', previous: '$339', change: 9 }, { label: 'Refunds', current: '$12K', previous: '$8K', change: -50 }]} />
    </div>
  ),
};
