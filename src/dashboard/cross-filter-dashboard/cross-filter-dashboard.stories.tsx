import type { Meta, StoryObj } from "@storybook/react";
import { CrossFilterDashboard } from "./cross-filter-dashboard";

const sampleFilters = [
  { id: "region", label: "Region", options: ["Americas (AMER)", "Europe & Middle East (EMEA)", "Asia Pacific (APAC)"] },
  { id: "segment", label: "Customer Segment", options: ["Enterprise", "Mid-Market", "SMB"] },
  { id: "fiscalYear", label: "Fiscal Period", options: ["FY2026-Q1", "FY2026-Q2", "FY2025-Q4"] },
];

const meta: Meta<typeof CrossFilterDashboard> = {
  title: "Dashboard/CrossFilterDashboard",
  component: CrossFilterDashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof CrossFilterDashboard>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 720, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <CrossFilterDashboard filters={sampleFilters}>
        <div
          style={{
            blockSize: 200,
            background: "var(--color-surface-sunken)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-text-secondary)",
          }}
        >
          Synchronized Analytics Canvas
        </div>
      </CrossFilterDashboard>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <CrossFilterDashboard
        filters={[
          { id: "dept", label: "Department", options: ["Engineering", "Operations", "Finance"] },
          { id: "status", label: "Job Status", options: ["Running", "Completed", "Failed"] },
        ]}
      >
        <div
          style={{
            paddingBlock: "var(--space-4)",
            paddingInline: "var(--space-4)",
            background: "var(--color-surface-sunken)",
            borderRadius: "var(--radius-md)",
          }}
        >
          Active Job Queue: 24 active tasks
        </div>
      </CrossFilterDashboard>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Multi-filter Dimension Header
        </h4>
        <CrossFilterDashboard filters={sampleFilters}>
          <div
            style={{
              paddingBlock: "var(--space-3)",
              paddingInline: "var(--space-3)",
              background: "var(--color-surface-sunken)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            Displaying filtered results according to selected dimensions.
          </div>
        </CrossFilterDashboard>
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Single Filter Minimal
        </h4>
        <CrossFilterDashboard
          filters={[{ id: "currency", label: "Currency", options: ["USD", "EUR", "GBP", "JPY"] }]}
        >
          <div
            style={{
              paddingBlock: "var(--space-3)",
              paddingInline: "var(--space-3)",
              background: "var(--color-surface-sunken)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            Currency converted ledger balances.
          </div>
        </CrossFilterDashboard>
      </div>
    </div>
  ),
};
