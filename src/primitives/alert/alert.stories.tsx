import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";
import { InlineMessage } from "./inline-message";

const meta: Meta<typeof Alert> = {
  title: "COMPONENTS/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "System Update Scheduled",
    children: "Maintenance will occur at 02:00 UTC.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Payment Received",
    children: "Invoice #INV-2026 has been marked as paid.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Subscription Expiring Soon",
    children: "Your trial expires in 3 days.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Sync Failed",
    children: "Could not connect to external ledger.",
  },
};
