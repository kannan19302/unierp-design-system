import type { Meta, StoryObj } from "@storybook/react";
import { LoadingOverlay } from "./loading-overlay";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Overlays/LoadingOverlay",
  component: LoadingOverlay,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

export const Default: Story = {
  args: {
    visible: true,
    message: "Calculating general ledger reconciliation...",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: "relative",
          width: 400,
          height: 240,
          border: "1px solid var(--color-border)",
          padding: "var(--space-4)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <p style={{ color: "var(--color-text-secondary)" }}>Underlying workspace and operational data grid.</p>
        <Story />
      </div>
    ),
  ],
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 500,
        height: 260,
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <h4 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>
        Enterprise Financial Migration
      </h4>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Batch processing 14,200 transaction records across distributed ledgers.
      </p>
      <LoadingOverlay
        visible={true}
        message="Syncing ledger transactions with central bank..."
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)", fontFamily: "var(--font-sans)" }}>
      <div
        style={{
          position: "relative",
          height: 200,
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          padding: "var(--space-3)",
        }}
      >
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>Standard Blur</h5>
        <LoadingOverlay visible={true} blur={true} message="Exporting dataset..." />
      </div>
      <div
        style={{
          position: "relative",
          height: 200,
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          padding: "var(--space-3)",
        }}
      >
        <h5 style={{ margin: "0 0 var(--space-2) 0", color: "var(--color-text-primary)" }}>Clear Overlay (No Blur)</h5>
        <LoadingOverlay visible={true} blur={false} message="Saving changes..." />
      </div>
    </div>
  ),
};
