import type { Meta, StoryObj } from "@storybook/react";
import { CTABanner } from "./cta-banner";

const meta: Meta<typeof CTABanner> = {
  title: "Blocks/CTABanner",
  component: CTABanner,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CTABanner>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <CTABanner headline="Ready to transform your business?" subtext="Join 10,000+ companies already using UniERP to streamline their operations." primaryAction={{ label: 'Start Free Trial' }} secondaryAction={{ label: 'Schedule Demo' }} />
    </div>
  ),
};
