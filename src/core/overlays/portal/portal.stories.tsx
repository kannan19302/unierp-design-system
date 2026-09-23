import type { Meta, StoryObj } from "@storybook/react";
import { Portal } from "./portal";

const meta: Meta<typeof Portal> = {
  title: "Core/Overlays/Portal",
  component: Portal,
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
type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: "var(--space-4)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-sans)" }}>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        The content below is rendered at document.body via Portal:
      </p>
      <Portal>
        <div style={{
          position: "fixed",
          bottom: "var(--space-4)",
          right: "var(--space-4)",
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
          fontSize: "var(--text-sm)",
          fontWeight: 500,
          color: "var(--color-text-primary)",
          zIndex: 9999,
        }}>
          Portaled floating notification
        </div>
      </Portal>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Portal mounts content outside the parent DOM subtree while preserving React context and event bubbling.
        </p>
      </div>
      <Portal>
        <div
          style={{
            position: "fixed",
            bottom: "var(--space-4)",
            left: "var(--space-4)",
            padding: "var(--space-2) var(--space-3)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-secondary)",
            zIndex: 9999,
          }}
        >
          Active Subtree Portal Target
        </div>
      </Portal>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <strong style={{ display: "block", marginBottom: "var(--space-2)" }}>Standard Document Body Mount</strong>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Target: document.body
        </span>
      </div>
      <div style={{ padding: "var(--space-4)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <strong style={{ display: "block", marginBottom: "var(--space-2)" }}>Custom Container Mount</strong>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Target: element ref or portal node
        </span>
      </div>
    </div>
  ),
};
