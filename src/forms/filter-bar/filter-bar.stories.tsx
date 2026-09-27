import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar, FilterTag } from "./filter-bar";

const meta: Meta<typeof FilterBar> = {
  title: "Core/Forms/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "button-name", enabled: true }],
      },
    },
  },
  argTypes: {
    onClearAll: {
      action: "filtersCleared",
      description: "Callback invoked to purge all active filter criteria",
    },
    children: {
      description: "FilterTag sequence rendered inside the bar",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  args: {
    onClearAll: () => {},
    children: (
      <>
        <FilterTag label="Fiscal Period" value="FY2026-Q1" onRemove={() => {}} />
        <FilterTag label="Status" value="Unposted" onRemove={() => {}} />
        <FilterTag label="Currency" value="USD" onRemove={() => {}} />
      </>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        FilterBar aggregates predicate tags with individual dismissal buttons alongside a global
        reset trigger within a micro-density horizontal ribbon.
      </p>
      <FilterBar onClearAll={() => {}}>
        <FilterTag label="Warehouse" value="WH-Austin-01" onRemove={() => {}} />
        <FilterTag label="Category" value="Heavy Industrial Machinery" onRemove={() => {}} />
        <FilterTag label="Min Qty" value="> 100" onRemove={() => {}} />
      </FilterBar>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Single Filter Pill</h5>
        <FilterBar onClearAll={() => {}}>
          <FilterTag label="Entity" value="Acme US Corp" onRemove={() => {}} />
        </FilterBar>
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Multiple Compound Ledger Filters</h5>
        <FilterBar onClearAll={() => {}}>
          <FilterTag label="GL Code" value="1010-CASH" onRemove={() => {}} />
          <FilterTag label="Date Range" value="2026-01-01 .. 2026-03-31" onRemove={() => {}} />
          <FilterTag label="Reconciled" value="No" onRemove={() => {}} />
          <FilterTag label="Variance" value="> $500.00" onRemove={() => {}} />
        </FilterBar>
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Read-only / Locked Filters (No Dismiss)</h5>
        <FilterBar>
          <FilterTag label="Tenant Partition" value="TENANT-ACME-ENTERPRISE" />
          <FilterTag label="Jurisdiction" value="United States (IRS)" />
        </FilterBar>
      </div>
    </div>
  ),
};
