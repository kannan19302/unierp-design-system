import type { Meta, StoryObj } from "@storybook/react";
import { AlertThresholdConfigurator } from "./alert-threshold-configurator";

const meta: Meta<typeof AlertThresholdConfigurator> = {
  title: "Dashboard/AlertThresholdConfigurator",
  component: AlertThresholdConfigurator,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AlertThresholdConfigurator>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <AlertThresholdConfigurator metric="CPU Usage" warningThreshold={70} criticalThreshold={90} unit="%" onSave={() => {}} />
    </div>
  ),
};
