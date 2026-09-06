import type { Meta, StoryObj } from "@storybook/react";
import { FeatureDeepDive } from "./feature-deep-dive";

const meta: Meta<typeof FeatureDeepDive> = {
  title: "Blocks/FeatureDeepDive",
  component: FeatureDeepDive,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FeatureDeepDive>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FeatureDeepDive features={[{ title: 'Real-Time Analytics', description: 'Monitor your business metrics in real-time with our advanced analytics engine. Track KPIs, revenue, and operational health.', icon: '📊' }, { title: 'Enterprise Security', description: 'Bank-grade encryption, SOC 2 compliance, and granular RBAC ensure your data is always protected.', icon: '🔒', align: 'right' }]} />
    </div>
  ),
};
