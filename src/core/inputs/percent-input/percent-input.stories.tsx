import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PercentInput, type PercentInputProps } from "./percent-input";

/**
 * ## PercentInput Primitive
 *
 * Dedicated numerical percentage input field featuring integrated suffix `%` glyph,
 * floating-point step increments, and automatic 0% - 100% clamping on blur.
 *
 * ### Key Capabilities
 * - **Fixed Suffix Glyph**: Integrated `%` symbol slot positioned without breaking layout flow.
 * - **Fractional Precision**: Supports fractional percentages (e.g. `8.25%`, `18.5%`).
 * - **Automatic Clamping**: Restricts input to configured minimum and maximum limits.
 */
const meta: Meta<typeof PercentInput> = {
  title: "Core/Inputs/PercentInput",
  component: PercentInput,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise percentage input with suffix glyph, fractional step controls, boundary clamping, and density scaling.",
      },
    },
  },
  argTypes: {
    value: { control: "number", description: "Numerical percentage value." },
    min: { control: "number", description: "Minimum allowable percentage." },
    max: { control: "number", description: "Maximum allowable percentage." },
    step: { control: "number", description: "Stepping increment for fractional percentage adjustment." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted opacity styling." },
    invalid: { control: "boolean", description: "Applies error border and sets aria-invalid." },
    placeholder: { control: "text", description: "Placeholder string." },
  },
};

export default meta;
type Story = StoryObj<typeof PercentInput>;

function InteractivePercentInput(props: Partial<PercentInputProps>) {
  const [val, setVal] = useState<number | undefined>(typeof props.value === "number" ? props.value : 18.5);
  return <PercentInput value={val} onChange={setVal} {...props} />;
}

export const Default: Story = {
  render: () => <InteractivePercentInput value={18.5} placeholder="0.0" />,
};

export const ClampedRange: Story = {
  render: () => <InteractivePercentInput min={0} max={100} value={75} />,
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [vatRate, setVatRate] = useState<number | undefined>(20.0);
  const [withholdingRate, setWithholdingRate] = useState<number | undefined>(5.5);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Statutory Tax Withholding Configuration
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Value Added Tax (VAT Rate)
            </label>
            <PercentInput value={vatRate} onChange={setVatRate} step={0.5} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Foreign Contractor Withholding
            </label>
            <PercentInput value={withholdingRate} onChange={setWithholdingRate} step={0.25} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, validation, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Core Percentage States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Empty / Placeholder</span>
          <PercentInput placeholder="0.0" />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Populated Value</span>
          <PercentInput value={25.0} />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Exceeds Max (Invalid)</span>
          <PercentInput value={150} invalid />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Policy Fixed Rate</span>
          <PercentInput value={8.25} disabled />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <PercentInput value={5.0} />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <PercentInput value={10.0} />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <PercentInput value={15.0} />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <PercentInput value={20.0} />
        </div>
      </div>
    </div>
  </div>
);
