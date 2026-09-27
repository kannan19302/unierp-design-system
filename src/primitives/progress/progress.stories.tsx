import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Core/Primitives/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### Progress — Linear Workload, Capacity & Batch Progression Indicator

The **Progress** primitive communicates deterministic or indeterminate operation progress across four sizing tiers and five semantic tonal variants.

#### Strata Design Specifications
- **Progress Track & Indicator**: Smooth CSS transition along hardware-accelerated transforms with high-contrast color fills.
- **Sizing Hierarchy**:
  - \`xs\` (4px): Ultra-compact inline progress for grid cells and micro cards.
  - \`sm\` (6px): Compact progress for sidebars and form controls.
  - \`md\` (8px): Standard enterprise default for general dashboard widgets.
  - \`lg\` (12px): High-prominence progress for wizard headers, file uploads, and bulk import operations.
- **Semantic Color Tones**: \`primary\` (accent), \`success\` (completed), \`warning\` (threshold alerts), \`danger\` (critical/capacity breach), and \`neutral\` (pending/staged).
- **Indeterminate Animation**: When \`value\` is omitted, renders continuous pulse sweep for unknown background processing durations.
- **WCAG 2.2 AA Compliance**: Employs \`role="progressbar"\` with \`aria-valuenow\`, \`aria-valuemin\`, \`aria-valuemax\`, and accessible label.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current completion value. When undefined, switches to indeterminate sweep.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "50" },
      },
    },
    max: {
      control: { type: "number", min: 10, max: 1000 },
      description: "Maximum boundary value (default 100).",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "100" },
      },
    },
    variant: {
      control: "select",
      options: ["primary", "success", "warning", "danger", "neutral"],
      description: "Semantic color scheme representing state or urgency.",
      table: {
        type: { summary: '"primary" | "success" | "warning" | "danger" | "neutral"' },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
      description: "Vertical bar track height tier.",
      table: {
        type: { summary: '"xs" | "sm" | "md" | "lg"' },
        defaultValue: { summary: "md" },
      },
    },
    label: {
      control: "text",
      description: "Accessible text label rendered above progress bar.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Progress" },
      },
    },
    showValue: {
      control: "boolean",
      description: "Whether to render percentage label beside the title header.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 65,
    max: 100,
    label: "Processing ledger batch",
    showValue: true,
    variant: "primary",
    size: "md",
  },
};

export const HalfSuccess: Story = {
  args: {
    value: 100,
    max: 100,
    variant: "success",
    label: "Sync Status",
    showValue: true,
  },
};

export const DangerWarning: Story = {
  args: {
    value: 92,
    max: 100,
    variant: "danger",
    label: "Memory Capacity",
    showValue: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Processing batch...",
    variant: "primary",
  },
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded inspection of Progress anatomy: header area (label + percentage readout), background track, and dynamic fill indicator bar.",
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
          Determinate Progress Composition (Header + Track + Fill)
        </div>
        <Progress value={68} max={100} size="md" variant="primary" label="Database Migration Batch #402" showValue />
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
          Indeterminate Sweep Composition (Continuous Ambient Processing)
        </div>
        <Progress size="sm" variant="neutral" label="Awaiting Kafka Broker Acknowledgement..." />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Full state matrix of Progress: All 4 size tiers (xs, sm, md, lg) and all 5 semantic tones (primary, success, warning, danger, neutral).",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 460 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Sizing Hierarchy (xs: 4px, sm: 6px, md: 8px, lg: 12px)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Progress value={45} size="xs" label="Micro (xs: 4px)" showValue />
          <Progress value={60} size="sm" label="Compact (sm: 6px)" showValue />
          <Progress value={75} size="md" label="Default (md: 8px)" showValue />
          <Progress value={90} size="lg" label="Spacious (lg: 12px)" showValue />
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
          2. Semantic Color Tones
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Progress value={70} variant="primary" label="Primary (Active Task)" showValue />
          <Progress value={100} variant="success" label="Success (100% Completed)" showValue />
          <Progress value={65} variant="warning" label="Warning (Quota Threshold Reached)" showValue />
          <Progress value={95} variant="danger" label="Danger (Memory / IOPS Critical)" showValue />
          <Progress value={35} variant="neutral" label="Neutral (Queued Background Job)" showValue />
        </div>
      </div>
    </div>
  ),
};
