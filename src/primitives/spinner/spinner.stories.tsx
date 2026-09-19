import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const VariantsAndButtons = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
        All Sizing Tiers (sm: 14px, md: 20px, lg: 32px)
      </div>
      <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
        Embedded in Interactive Controls (Loading States)
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <button
          type="button"
          disabled
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-primary)",
            color: "var(--color-text-inverse)",
            border: "none",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
            cursor: "not-allowed",
          }}
        >
          <Spinner size="sm" variant="white" />
          <span>Submitting Batch...</span>
        </button>
        <button
          type="button"
          disabled
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-4)",
            borderRadius: "var(--radius-sm)",
            background: "var(--color-bg-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
            cursor: "not-allowed",
          }}
        >
          <Spinner size="sm" variant="primary" />
          <span>Refreshing Ledger...</span>
        </button>
      </div>
    </div>
  </div>
);
