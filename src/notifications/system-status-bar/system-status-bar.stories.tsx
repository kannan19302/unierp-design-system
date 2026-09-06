import type { Meta, StoryObj } from "@storybook/react";
import { SystemStatusBar } from "./system-status-bar";

const meta: Meta<typeof SystemStatusBar> = {
  title: "Notifications/SystemStatusBar",
  component: SystemStatusBar,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SystemStatusBar>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <SystemStatusBar status="operational" lastChecked="30s ago" />
    </div>
  ),
};
