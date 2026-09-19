import type { Meta, StoryObj } from "@storybook/react";
import { InfoHint } from "./info-hint";

const meta: Meta<typeof InfoHint> = {
  title: "Primitives/InfoHint",
  component: InfoHint,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### InfoHint — Contextual Micro-Assistance Trigger

The **InfoHint** primitive displays an accessible information beacon (i-icon) that exposes contextual micro-help or field guidance via an integrated floating tooltip when hovered or keyboard-focused.

#### Strata Design Specifications
- **Sizing Hierarchy**: Defaults to 14px for inline form field labels; supports custom scaling (12px, 16px, 18px).
- **Keyboard Navigation**: Focusable via \`tabIndex={0}\` with accessible \`aria-label\` and high-contrast outline on focus-visible.
- **Form Integration**: Aligns cleanly beside required indicators and form labels without introducing layout shifts.
- **WCAG 2.2 AA Compliance**: Screen reader announcements via \`role="img"\` and descriptive tooltip triggers.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Short plain-language explanation of what the adjacent control does.",
      table: {
        type: { summary: "ReactNode" },
        defaultValue: { summary: "Contextual micro-assistance guidance." },
      },
    },
    size: {
      control: { type: "number", min: 10, max: 24, step: 2 },
      description: "Icon diameter in pixels (default 14).",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "14" },
      },
    },
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

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded inspection of InfoHint within form labels and tabular metadata headers.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 380 }}>
      <div
        style={{
          border: "1px dashed var(--color-border-focus)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider, 0.05em)",
          }}
        >
          Form Label Composition (Label + Required Star + Hint)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1-5)" }}>
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
            <span style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)" }}>*</span>
            <InfoHint text="Format: ISO country prefix (2 letters) followed by 8 to 12 alphanumeric characters." />
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
      </div>

      <div
        style={{
          border: "1px dashed var(--color-border-focus)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider, 0.05em)",
          }}
        >
          Table Column Header Composition
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-1-5)",
            padding: "var(--space-1-5) var(--space-3)",
            background: "var(--color-bg-elevated)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
          }}
        >
          <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)" }}>
            Weighted Avg Cost of Capital (WACC)
          </span>
          <InfoHint text="Calculated dynamically across active equity debt tranches under IFRS-9 standards." />
        </div>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Matrix of InfoHint across sizing scales (12px, 14px, 16px, 18px) and rich contextual descriptions.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 400 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Size Variations
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>12px:</span>
            <InfoHint size={12} text="Compact 12px info hint for micro-badges." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>14px (Default):</span>
            <InfoHint size={14} text="Standard 14px info hint for forms." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>16px:</span>
            <InfoHint size={16} text="Prominent 16px info hint." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>18px:</span>
            <InfoHint size={18} text="Large 18px info hint for headers." />
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          2. Rich Markdown & Formatting Content
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-2) var(--space-3)",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}
        >
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }}>
            Hover for multi-line governance policy
          </span>
          <InfoHint
            size={14}
            text={
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <strong>Policy SEC-0042</strong>
                <span>All GL journal adjustments exceeding $50,000 require dual CFO signoff.</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  ),
};
