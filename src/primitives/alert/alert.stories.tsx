import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";
import { Button } from "../button";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
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

export const InteractiveWithDismiss = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 540 }}>
    <Alert
      variant="info"
      title="Background Synchronization"
      onClose={() => alert("Dismissed info alert")}
      action={
        <Button variant="outline" size="sm">
          View Logs
        </Button>
      }
    >
      Reconciling 1,420 multi-currency transactions across ledger accounts.
    </Alert>

    <Alert
      variant="danger"
      title="Access Token Expired"
      onClose={() => alert("Dismissed danger alert")}
      action={
        <Button variant="danger" size="sm">
          Re-authenticate
        </Button>
      }
    >
      Your OAuth session has expired. Please log in again to continue.
    </Alert>
  </div>
);

export const FeedbackGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 540 }}>
    <Alert variant="info" title="Information">New tax rules take effect on October 1st.</Alert>
    <Alert variant="success" title="Success">Batch #9023 posted to General Ledger.</Alert>
    <Alert variant="warning" title="Warning">5 journal entries require dual approval.</Alert>
    <Alert variant="danger" title="Error">Posting failed: Unbalanced debit and credit entries.</Alert>
  </div>
);

