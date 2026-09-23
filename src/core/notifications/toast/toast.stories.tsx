import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastProvider, useToast } from "./toast";

const ToastDemo = () => {
  const toast = useToast();
  return (
    <div style={{ display: "flex", gap: "var(--space-2)", padding: "var(--space-4)" }}>
      <button
        type="button"
        onClick={() => toast.success("Saved!", "Your changes were synced")}
        style={{
          padding: "var(--space-2) var(--space-3)",
          background: "var(--color-success)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
      >
        Success Toast
      </button>
      <button
        type="button"
        onClick={() => toast.error("Deployment Failed", "Check console logs for stack trace")}
        style={{
          padding: "var(--space-2) var(--space-3)",
          background: "var(--color-danger)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
      >
        Error Toast
      </button>
      <button
        type="button"
        onClick={() => toast.warning("Quota Warning", "Approaching 90% DB limit")}
        style={{
          padding: "var(--space-2) var(--space-3)",
          background: "var(--color-warning)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
      >
        Warning Toast
      </button>
      <button
        type="button"
        onClick={() => toast.info("System Update", "Maintenance window at 02:00 UTC")}
        style={{
          padding: "var(--space-2) var(--space-3)",
          background: "var(--color-primary)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
        }}
      >
        Info Toast
      </button>
    </div>
  );
};

const meta: Meta = {
  title: "Core/Notifications/Toast",
  component: ToastDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ width: 380, display: "flex", flexDirection: "column", gap: "var(--space-3)", fontFamily: "var(--font-sans)" }}>
      <Toast
        title="Payment Processed"
        description="Wire transfer for invoice #901 settled."
        variant="success"
        onDismiss={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ width: 380, display: "flex", flexDirection: "column", gap: "var(--space-3)", fontFamily: "var(--font-sans)" }}>
      <Toast
        title="Record Saved"
        description="Employee profile updated."
        variant="success"
        onDismiss={() => {}}
      />
      <Toast
        title="Network Disconnected"
        description="Retrying connection to cluster in 5s."
        variant="warning"
        onDismiss={() => {}}
      />
      <Toast
        title="Validation Error"
        description="Tax identification number cannot be blank."
        variant="error"
        onDismiss={() => {}}
      />
      <Toast
        title="Scheduled Maintenance"
        description="Cluster upgrade scheduled for 03:00 UTC."
        variant="info"
        onDismiss={() => {}}
      />
    </div>
  ),
};
