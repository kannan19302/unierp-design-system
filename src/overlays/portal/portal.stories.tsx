import type { Meta, StoryObj } from "@storybook/react";
import { Portal } from "./portal";

const meta: Meta<typeof Portal> = {
  title: "Overlays/Portal",
  component: Portal,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        The content below is rendered at document.body via Portal:
      </p>
      <Portal>
        <div style={{
          position: "fixed",
          bottom: "var(--space-4)",
          right: "var(--space-4)",
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-surface-elevated)",
          border: "1px solid var(--color-border-default)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          fontSize: "var(--text-sm)",
          fontWeight: 500
        }}>
          🚀 Portaled floating banner
        </div>
      </Portal>
    </div>
  ),
};
