import type { Meta, StoryObj } from "@storybook/react";
import { IntegrationShowcase } from "./integration-showcase";

const meta: Meta<typeof IntegrationShowcase> = {
  title: "Blocks/IntegrationShowcase",
  component: IntegrationShowcase,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof IntegrationShowcase>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <IntegrationShowcase integrations={[{ name: 'Slack', icon: '💬', category: 'Communication' }, { name: 'Stripe', icon: '💳', category: 'Payments' }, { name: 'AWS', icon: '☁️', category: 'Cloud' }, { name: 'GitHub', icon: '🐙', category: 'Dev Tools' }, { name: 'Salesforce', icon: '☁️', category: 'CRM' }, { name: 'Jira', icon: '📋', category: 'Dev Tools' }]} />
    </div>
  ),
};
