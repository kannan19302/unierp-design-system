import type { Meta, StoryObj } from "@storybook/react";
import { StatsCounter } from "./stats-counter";

const meta: Meta<typeof StatsCounter> = {
  title: "Blocks/StatsCounter",
  component: StatsCounter,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof StatsCounter>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <StatsCounter stats={[{ value: '10,000+', label: 'Customers Worldwide' }, { value: '99.99%', label: 'Uptime SLA' }, { value: '$2B+', label: 'Transactions Processed' }, { value: '150+', label: 'Countries Served' }]} />
    </div>
  ),
};
