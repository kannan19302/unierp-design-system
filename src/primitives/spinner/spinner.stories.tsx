import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "./spinner";
import { Button } from "../button";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### Spinner — Indeterminate Activity Indicator

The **Spinner** primitive provides an animated rotational indicator used to signify background I/O, pending RPC dispatch, or form submission without blocking the entire page layout.

#### Strata Design Specifications
- **Sizing Hierarchy**:
  - \`sm\` (14px): Embedded inside compact buttons and inline table badges.
  - \`md\` (20px): Default standalone indicator for cards and dialog panes.
  - \`lg\` (32px): High-prominence loader for full-page or section initializations.
- **Color Variations**:
  - \`primary\`: Strata brand accent fill.
  - \`white\`: High-contrast inverse white fill for saturated action buttons.
  - \`current\`: Inherits currentColor for adaptive styling within links or badges.
- **WCAG 2.2 AA Compliance**: Implements \`role="status"\`, \`aria-label="Loading"\`, and hidden \`.sr-only\` text.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Visual diameter scaling tier.",
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: "md" },
      },
    },
    variant: {
      control: "select",
      options: ["primary", "current", "white"],
      description: "Color tone of the spinner ring.",
      table: {
        type: { summary: '"primary" | "current" | "white"' },
        defaultValue: { summary: "primary" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: "md",
    variant: "primary",
  },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded inspection of Spinner anatomy: animated SVG track ring, accent arc stroke, and accessibility screen-reader label.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 440 }}>
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
          Standalone Container Composition
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-6)",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Spinner size="lg" variant="primary" />
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
          Interactive Button Integration (Loading State)
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <Button variant="primary" size="sm" disabled>
            <Spinner size="sm" variant="white" />
            <span>Posting Entry...</span>
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Spinner size="sm" variant="primary" />
            <span>Syncing Ledger...</span>
          </Button>
        </div>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Complete matrix of Spinner states: All sizes (sm: 14px, md: 20px, lg: 32px) across all color variants (primary, white, current).",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", width: 440 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Size Hierarchy
        </div>
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
            <Spinner size="sm" />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>sm (14px)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
            <Spinner size="md" />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>md (20px)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)" }}>
            <Spinner size="lg" />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>lg (32px)</span>
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
          2. Variant & Contrast Contexts
        </div>
        <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-bg-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Spinner size="sm" variant="primary" />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text)" }}>Primary Variant</span>
          </div>
          <div
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-primary)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
            }}
          >
            <Spinner size="sm" variant="white" />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-inverse)" }}>White Variant</span>
          </div>
        </div>
      </div>
    </div>
  ),
};
