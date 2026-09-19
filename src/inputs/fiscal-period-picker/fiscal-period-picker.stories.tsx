import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FiscalPeriodPicker, type FiscalPeriodPickerProps } from "./fiscal-period-picker";

/**
 * ## FiscalPeriodPicker Primitive
 *
 * Dedicated quarterly accounting period selector supporting custom international fiscal start
 * months (e.g. US January, UK April, Australian July), period boundaries, and ledger filtering.
 *
 * ### Key Capabilities
 * - **Dynamic Period Generation**: Automatically derives Q1-Q4 date intervals given an arbitrary fiscal start month.
 * - **International GAAP Alignment**: Seamlessly supports standard non-calendar fiscal accounting years.
 * - **High Density**: Compact footprint designed for top-level filter bars and ledger cockpits.
 */
const meta: Meta<typeof FiscalPeriodPicker> = {
  title: "Inputs/FiscalPeriodPicker",
  component: FiscalPeriodPicker,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise quarterly fiscal accounting period selector with support for global fiscal year start months and density scaling.",
      },
    },
  },
  argTypes: {
    fiscalYear: { control: "number", description: "Target fiscal year integer (e.g. 2026)." },
    fiscalYearStartMonth: { control: "number", description: "Start month of the fiscal year (1 for Jan, 4 for Apr, 7 for Jul)." },
    disabled: { control: "boolean", description: "Disables period switching." },
  },
};

export default meta;
type Story = StoryObj<typeof FiscalPeriodPicker>;

function InteractiveFiscalPeriodPicker(props: Partial<FiscalPeriodPickerProps>) {
  const [period, setPeriod] = useState<string>("FY2026-Q1");
  return <FiscalPeriodPicker selectedPeriod={period} onSelectPeriod={setPeriod} {...props} />;
}

export const CalendarYear: Story = {
  render: () => <InteractiveFiscalPeriodPicker fiscalYear={2026} fiscalYearStartMonth={1} />,
};

export const UKFiscalYear: Story = {
  render: () => <InteractiveFiscalPeriodPicker fiscalYear={2026} fiscalYearStartMonth={4} />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [period, setPeriod] = useState("FY2026-Q3");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          General Ledger Quarterly Reconciler
        </h4>
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
          <FiscalPeriodPicker
            fiscalYear={2026}
            fiscalYearStartMonth={1}
            selectedPeriod={period}
            onSelectPeriod={setPeriod}
          />
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Reconciliation status: <strong>Open for Adjustments</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, international fiscal, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        International Accounting Jurisdictions
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>US Calendar Year (Jan - Dec)</span>
          <FiscalPeriodPicker fiscalYear={2026} fiscalYearStartMonth={1} />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>UK / India Fiscal Year (Apr - Mar)</span>
          <FiscalPeriodPicker fiscalYear={2026} fiscalYearStartMonth={4} />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Australian Fiscal Year (Jul - Jun)</span>
          <FiscalPeriodPicker fiscalYear={2026} fiscalYearStartMonth={7} />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Closed Period</span>
          <FiscalPeriodPicker fiscalYear={2025} disabled />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <FiscalPeriodPicker fiscalYear={2026} />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <FiscalPeriodPicker fiscalYear={2026} />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <FiscalPeriodPicker fiscalYear={2026} />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <FiscalPeriodPicker fiscalYear={2026} />
        </div>
      </div>
    </div>
  </div>
);
