import type { Meta, StoryObj } from "@storybook/react";
import { InfoHint } from "./info-hint";

const meta: Meta<typeof InfoHint> = {
  title: "Primitives/InfoHint",
  component: InfoHint,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof InfoHint>;

export const Default: Story = {
  args: {
    text: "This field specifies the fiscal year end date.",
    size: 14,
  },
};

export const Large: Story = {
  args: {
    text: "Administrative permission required to modify tax rates.",
    size: 18,
  },
};

export const InlineFormField = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-1-5)",
      width: 320,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
      <label
        htmlFor="vat-id"
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: "var(--weight-medium)",
          color: "var(--color-text)",
        }}
      >
        EU VAT Identification Number
      </label>
      <InfoHint text="Format: Country code prefix followed by 8-12 alphanumeric characters." />
    </div>
    <input
      id="vat-id"
      defaultValue="DE123456789"
      style={{
        padding: "var(--space-1-5) var(--space-2-5)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-surface)",
        color: "var(--color-text)",
        fontSize: "var(--text-xs)",
      }}
    />
  </div>
);
