import type { Meta, StoryObj } from "@storybook/react";
import { NewsletterSignup } from "./newsletter-signup";

const meta: Meta<typeof NewsletterSignup> = {
  title: "Blocks/NewsletterSignup",
  component: NewsletterSignup,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof NewsletterSignup>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <NewsletterSignup title="Stay in the Loop" subtitle="Product updates, engineering insights, and industry best practices." />
    </div>
  ),
};
