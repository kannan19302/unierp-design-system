import type { Meta, StoryObj } from "@storybook/react";
import { PresenceIndicator } from "./presence-indicator";

const meta: Meta<typeof PresenceIndicator> = {
  title: "Notifications/PresenceIndicator",
  component: PresenceIndicator,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof PresenceIndicator>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <PresenceIndicator status="online" name="Jane Smith" statusMessage="In a meeting until 3 PM" />
    </div>
  ),
};
