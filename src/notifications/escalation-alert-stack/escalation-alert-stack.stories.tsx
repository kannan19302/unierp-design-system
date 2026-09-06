import type { Meta, StoryObj } from "@storybook/react";
import { EscalationAlertStack } from "./escalation-alert-stack";

const meta: Meta<typeof EscalationAlertStack> = {
  title: "Notifications/EscalationAlertStack",
  component: EscalationAlertStack,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof EscalationAlertStack>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <EscalationAlertStack alerts={[{ id: '1', title: 'Database CPU at 98%', severity: 'critical', timestamp: '30s ago', source: 'prod-db-01' }, { id: '2', title: 'API Error Rate > 5%', severity: 'high', timestamp: '2 min ago', source: 'api-gateway' }]} onAcknowledge={() => {}} onSnooze={() => {}} />
    </div>
  ),
};
