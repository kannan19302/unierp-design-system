import type { Meta, StoryObj } from "@storybook/react";
import { ProgressNotification } from "./progress-notification";

const meta: Meta<typeof ProgressNotification> = {
  title: "Notifications/ProgressNotification",
  component: ProgressNotification,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ProgressNotification>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ProgressNotification title="Deploying v3.2.1 to Production" progress={67} status="running" message="Building container images..." onCancel={() => {}} />
    </div>
  ),
};
