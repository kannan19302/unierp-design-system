import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterChipGroup, type FilterChip } from "./filter-chip-group";

/**
 * ## FilterChipGroup Primitive
 *
 * Compact row of active filter criterion pills with individual dismiss buttons and bulk clear actions,
 * engineered for ledger tables, CRM opportunity views, inventory queries, and analytics dashboards.
 *
 * ### Key Capabilities
 * - **Dismissible Filter Pills**: Individual dismiss actions with accessible keyboard labels.
 * - **Bulk Clear Action**: Integrated `Clear All` reset mechanism.
 * - **4-Tier Density Ergonomics**: Ultra-compact (20px) through comfortable (32px) scaling.
 */
const meta: Meta<typeof FilterChipGroup> = {
  title: "Core/Inputs/FilterChipGroup",
  component: FilterChipGroup,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise active filter chips bar with dismissible pills, bulk clear trigger, and 4-tier density scaling.",
      },
    },
  },
  argTypes: {
    chips: { control: "object", description: "Array of active FilterChip objects." },
    prefixLabel: { control: "text", description: "Prefix label preceding the chips list." },
    density: { control: "select", options: ["ultra-compact", "compact", "standard", "comfortable"], description: "Ergonomic density scaling." },
  },
};

export default meta;
type Story = StoryObj<typeof FilterChipGroup>;

const initialChips: FilterChip[] = [
  { id: "c1", field: "Status", label: "Active", value: "active" },
  { id: "c2", field: "Department", label: "Operations", value: "ops" },
  { id: "c3", field: "Fiscal Period", label: "FY2026-Q3", value: "fy26q3" },
];

export const Default: Story = {
  render: () => {
    const [chips, setChips] = useState<FilterChip[]>(initialChips);
    return (
      <FilterChipGroup
        chips={chips}
        onRemoveChip={(id) => setChips((prev) => prev.filter((c) => c.id !== id))}
        onClearAll={() => setChips([])}
      />
    );
  },
};

export const AnatomyAndComposition = () => {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "status", field: "Workflow State", label: "Pending Approval", value: "pending" },
    { id: "tier", field: "Vendor Tier", label: "Tier 1 Strategic", value: "t1" },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "560px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Procurement Requisition Filters
        </h4>
        <FilterChipGroup
          chips={chips}
          onRemoveChip={(id) => setChips((prev) => prev.filter((c) => c.id !== id))}
          onClearAll={() => setChips([])}
        />
      </div>
    </div>
  );
};

export const AllStatesGallery = () => {
  const demoChips: FilterChip[] = [
    { id: "1", field: "Region", label: "North America", value: "na" },
    { id: "2", field: "Currency", label: "USD ($)", value: "usd" },
    { id: "3", field: "Audit Policy", label: "SOX-404", value: "sox", removable: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "600px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Chip Variants (Removable & Non-Removable)
        </h4>
        <FilterChipGroup chips={demoChips} onRemoveChip={() => {}} onClearAll={() => {}} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          4-Tier Ergonomic Density Matrix
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterChipGroup density="ultra-compact" chips={demoChips} />
          </div>
          <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterChipGroup density="compact" chips={demoChips} />
          </div>
          <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterChipGroup density="standard" chips={demoChips} />
          </div>
          <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterChipGroup density="comfortable" chips={demoChips} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const V1WorkspacePreview = () => {
  const [chips, setChips] = useState<FilterChip[]>([
    { id: "f1", field: "Ledger Account", label: "1000 - Cash & Equivalents", value: "1000" },
    { id: "f2", field: "Fiscal Quarter", label: "FY2026-Q3", value: "q3" },
    { id: "f3", field: "Threshold", label: "> $50,000", value: "gt50k" },
  ]);

  return (
    <div style={{ padding: "var(--space-6)", background: "var(--color-bg-canvas)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "640px" }}>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
          General Ledger Query Cockpit
        </h3>
        <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Active filtering criteria applied across 14,892 journal transaction records.
        </p>
      </div>

      <FilterChipGroup
        chips={chips}
        onRemoveChip={(id) => setChips((prev) => prev.filter((c) => c.id !== id))}
        onClearAll={() => setChips([])}
        density="standard"
      />

      <div style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Showing 42 matching entries of 14,892 total
        </span>
      </div>
    </div>
  );
};

export const StateMatrix = () => {
  const sample: FilterChip[] = [
    { id: "a", field: "Status", label: "Active", value: "1" },
    { id: "b", field: "Region", label: "EMEA", value: "2" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "500px" }}>
      <FilterChipGroup chips={sample} onRemoveChip={() => {}} onClearAll={() => {}} />
      <FilterChipGroup chips={sample} onRemoveChip={() => {}} />
    </div>
  );
};
