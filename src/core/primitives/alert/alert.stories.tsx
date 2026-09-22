import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./alert";
import { Button } from "../button";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "High-visibility feedback and announcement banner for system statuses, warnings, validation summaries, and critical errors. Fully responsive, WCAG 2.2 AA compliant.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
      description: "Semantic color tone and visual accent border.",
      table: {
        type: { summary: "info | success | warning | danger" },
        defaultValue: { summary: "info" },
      },
    },
    title: {
      control: "text",
      description: "Bold header summary text at the top of the banner.",
    },
    children: {
      control: "text",
      description: "Main informative body message or React children.",
    },
    onClose: {
      action: "closed",
      description: "Callback invoked when the user clicks the dismiss button.",
    },
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

export const AnatomyAndComposition = () => (
  <div style={{ maxWidth: 560 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
      Sub-elements: Leading Semantic Icon + Title Header + Rich Description + Action Button + Dismiss Trigger
    </div>
    <Alert
      variant="warning"
      title="Dual Authorization Required"
      action={
        <Button variant="outline" size="sm">
          Review Approval
        </Button>
      }
      onClose={() => {}}
    >
      Wire transfer #TRX-9482 exceeding $50,000 threshold requires secondary CFO sign-off before dispatch.
    </Alert>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", maxWidth: 560 }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        All Tones in One Place (Info, Success, Warning, Danger)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Alert variant="info" title="Information">New tax rules take effect on October 1st.</Alert>
        <Alert variant="success" title="Success">Batch #9023 posted to General Ledger.</Alert>
        <Alert variant="warning" title="Warning">5 journal entries require dual approval.</Alert>
        <Alert variant="danger" title="Error">Posting failed: Unbalanced debit and credit entries.</Alert>
      </div>
    </div>

    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Interactive & Actionable States
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <Alert
          variant="info"
          title="Background Reconciliation"
          action={<Button size="sm" variant="outline">View Progress</Button>}
          onClose={() => {}}
        >
          Reconciling 1,420 multi-currency transactions across ledger accounts.
        </Alert>
        <Alert
          variant="danger"
          title="Critical Session Interruption"
          action={<Button size="sm" variant="danger">Re-login</Button>}
          onClose={() => {}}
        >
          Your cryptographic token expired. Please re-authenticate to prevent data loss.
        </Alert>
      </div>
    </div>
  </div>
);

