import type { Meta, StoryObj } from "@storybook/react";
import { ToastProvider, useToast } from "./toast";

const ToastDemo = () => {
  const toast = useToast();
  return (
    <div style={{ display: "flex", gap: "var(--space-2)", padding: "var(--space-4)" }}>
      <button
        type="button"
        onClick={() => toast.success("Saved!", "Your changes were synced")}
        style={{ padding: "var(--space-2) var(--space-3)", background: "var(--color-success, #10b981)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
      >
        Success Toast
      </button>
      <button
        type="button"
        onClick={() => toast.error("Deployment Failed", "Check console logs for stack trace")}
        style={{ padding: "var(--space-2) var(--space-3)", background: "var(--color-danger, #ef4444)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
      >
        Error Toast
      </button>
      <button
        type="button"
        onClick={() => toast.warning("Quota Warning", "Approaching 90% DB limit")}
        style={{ padding: "var(--space-2) var(--space-3)", background: "var(--color-warning, #f59e0b)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
      >
        Warning Toast
      </button>
      <button
        type="button"
        onClick={() => toast.info("System Update", "Maintenance window at 02:00 UTC")}
        style={{ padding: "var(--space-2) var(--space-3)", background: "var(--color-primary, #3b82f6)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer" }}
      >
        Info Toast
      </button>
    </div>
  );
};

const meta: Meta = {
  title: "Notifications/Toast",
  component: ToastDemo,
  parameters: { layout: "centered" },
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
