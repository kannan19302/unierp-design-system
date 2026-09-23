import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CurrencyInput, type CurrencyInputProps } from "./currency-input";

/**
 * ## CurrencyInput Primitive
 *
 * Financial-grade decimal input engineered for accounts payable/receivable, purchase orders,
 * tax rate adjustments, and general ledger journal postings.
 *
 * ### Key Capabilities
 * - **Pre-formatted Currency Prefix**: Integrates $, €, £, ¥, or custom currency symbol prefixes.
 * - **Two-Decimal Automatic Precision**: Automatically formats fractional sub-units (`.00`) on blur.
 * - **Negative Balance Validation**: Visual error state for prohibited negative or out-of-bounds debits.
 */
const meta: Meta<typeof CurrencyInput> = {
  title: "Core/Inputs/CurrencyInput",
  component: CurrencyInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise currency input with prefix currency symbols, two-decimal auto-formatting, validation styling, and density scaling.",
      },
    },
  },
  argTypes: {
    currencySymbol: { control: "text", description: "Currency symbol glyph rendered in prefix slot." },
    value: { control: "number", description: "Numerical monetary value." },
    placeholder: { control: "text", description: "Placeholder string." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted opacity styling." },
    invalid: { control: "boolean", description: "Applies error border and sets aria-invalid." },
  },
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

function InteractiveCurrencyInput(props: Partial<CurrencyInputProps>) {
  const [val, setVal] = useState<number | undefined>(typeof props.value === "number" ? props.value : 1250.5);
  return <CurrencyInput value={val} onChange={setVal} {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveCurrencyInput value={1250.5} currencySymbol="$" />,
};

export const Euro: Story = {
  render: () => <InteractiveCurrencyInput value={8400.0} currencySymbol="€" />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [baseAmount, setBaseAmount] = useState<number | undefined>(14500);
  const [taxAmount, setTaxAmount] = useState<number | undefined>(1160);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Invoice Total Calculation Ledger
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Subtotal Net Amount
            </label>
            <CurrencyInput currencySymbol="$" value={baseAmount} onChange={setBaseAmount} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Tax Rate (8%)
            </label>
            <CurrencyInput currencySymbol="$" value={taxAmount} onChange={setTaxAmount} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, international currency, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        International Currencies ($ USD, € EUR, £ GBP, ¥ JPY)
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <CurrencyInput currencySymbol="$" value={25000.75} />
        <CurrencyInput currencySymbol="€" value={18950.0} />
        <CurrencyInput currencySymbol="£" value={14200.5} />
        <CurrencyInput currencySymbol="¥" value={3500000} />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Validation & Disabled States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Empty / Placeholder</span>
          <CurrencyInput currencySymbol="$" placeholder="0.00" />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Prohibited Deficit (Invalid)</span>
          <CurrencyInput currencySymbol="$" value={-500} invalid />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Posted Ledger</span>
          <CurrencyInput currencySymbol="$" value={98450} disabled />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <CurrencyInput currencySymbol="$" value={100} />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <CurrencyInput currencySymbol="$" value={250} />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <CurrencyInput currencySymbol="$" value={500} />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <CurrencyInput currencySymbol="$" value={1000} />
        </div>
      </div>
    </div>
  </div>
);
