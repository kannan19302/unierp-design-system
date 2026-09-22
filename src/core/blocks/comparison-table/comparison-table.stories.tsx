import type { Meta, StoryObj } from "@storybook/react";
import { ComparisonTable } from "./comparison-table";

const meta: Meta<typeof ComparisonTable> = {
  title: "Blocks/ComparisonTable",
  component: ComparisonTable,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ComparisonTable>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ComparisonTable plans={[{ id: 'starter', name: 'Starter', price: '$29/mo', cta: 'Get Started' }, { id: 'pro', name: 'Pro', price: '$99/mo', cta: 'Start Free Trial' }, { id: 'enterprise', name: 'Enterprise', price: 'Custom', cta: 'Contact Sales' }]} features={[{ label: 'Users', values: { starter: '5', pro: '25', enterprise: 'Unlimited' } }, { label: 'Storage', values: { starter: '10GB', pro: '100GB', enterprise: '1TB' } }, { label: 'API Access', values: { starter: false, pro: true, enterprise: true } }, { label: 'SSO', values: { starter: false, pro: false, enterprise: true } }]} highlightPlan="pro" />
    </div>
  ),
};
