import type { Meta, StoryObj } from "@storybook/react";
import { AlertBanner } from "./alert-banner";

const meta: Meta<typeof AlertBanner> = {
  title: "Notifications/AlertBanner",
  component: AlertBanner,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AlertBanner>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <AlertBanner variant="warning" title="Scheduled Maintenance" message="The system will be unavailable on Sept 7, 2026 from 2:00 AM - 4:00 AM UTC." action={{ label: 'Learn More', onClick: () => {} }} />
    </div>
  ),
};
