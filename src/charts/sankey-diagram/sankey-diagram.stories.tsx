import type { Meta, StoryObj } from "@storybook/react";
import { SankeyDiagram } from "./sankey-diagram";

const meta: Meta<typeof SankeyDiagram> = {
  title: "Charts/SankeyDiagram",
  component: SankeyDiagram,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SankeyDiagram>;

export const Default: Story = {
  render: () => {
    const nodes = [
    { id: 'organic', label: 'Organic', color: '#10b981' },
    { id: 'paid', label: 'Paid Ads', color: '#2563eb' },
    { id: 'referral', label: 'Referral', color: '#8b5cf6' },
    { id: 'signup', label: 'Signups', color: '#f59e0b' },
    { id: 'trial', label: 'Trial', color: '#06b6d4' },
    { id: 'paid_plan', label: 'Paid Plan', color: '#10b981' },
  ];
  const links = [
    { source: 'organic', target: 'signup', value: 4500 },
    { source: 'paid', target: 'signup', value: 3200 },
    { source: 'referral', target: 'signup', value: 1800 },
    { source: 'signup', target: 'trial', value: 6200 },
    { source: 'signup', target: 'paid_plan', value: 3300 },
  ];
    return (
      <div style={{ width: 500, padding: "var(--space-4)" }}>
        <SankeyDiagram nodes={nodes} links={links} />
      </div>
    );
  },
};
