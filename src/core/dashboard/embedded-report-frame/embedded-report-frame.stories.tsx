import type { Meta, StoryObj } from "@storybook/react";
import { EmbeddedReportFrame } from "./embedded-report-frame";

const meta: Meta<typeof EmbeddedReportFrame> = {
  title: "Core/Dashboard/EmbeddedReportFrame",
  component: EmbeddedReportFrame,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof EmbeddedReportFrame>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 680, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <EmbeddedReportFrame
        title="Q3 Consolidated Profit & Loss"
        src="https://analytics.unierp.internal/reports/pnl-q3-2026"
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 680, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <EmbeddedReportFrame
        title="Telemetry Pipeline Health"
        src="https://grafana.internal/d/unierp-services"
        height={260}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 680, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Loading State
        </h4>
        <EmbeddedReportFrame
          title="Sales Pipeline Forecast"
          loading
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Error State
        </h4>
        <EmbeddedReportFrame
          title="Tax Audit Compliance Ledger"
          error="Failed to authenticate external reporting provider (SSO Token Expired)."
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Empty / Unconfigured State
        </h4>
        <EmbeddedReportFrame
          title="Custom BI Visualizer"
        />
      </div>
    </div>
  ),
};
