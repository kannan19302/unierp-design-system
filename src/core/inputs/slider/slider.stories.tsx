import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Slider, type SliderProps } from "./slider";

/**
 * ## Strata V1 Slider Primitive
 *
 * Accessible continuous and stepped range slider engineered to the SideNav V1 reference standard:
 * - **W3C Range Semantics**: Native HTML range input with `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.
 * - **Tabular Value Readout**: Monospace tabular-nums indicator badge for financial precision.
 * - **4-Tier Density**: `ultra-compact` (24px context), `compact` (28px), `standard` (32px), `comfortable` (40px).
 */
const meta: Meta<typeof Slider> = {
  title: "Core/Inputs/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise range slider input supporting continuous values, stepped snap points, numerical readout displays, and density scaling.",
      },
    },
  },
  argTypes: {
    min: { control: "number", description: "Minimum selectable range value." },
    max: { control: "number", description: "Maximum selectable range value." },
    step: { control: "number", description: "Granular stepping increment for value snapping." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted track styling." },
    showValue: { control: "boolean", description: "Renders numerical badge showing current value." },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

function ReserveAllocationWorkbench() {
  const [reserveRatio, setReserveRatio] = useState(35);
  const [interestSpread, setInterestSpread] = useState(1.75);
  const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");

  return (
    <div
      data-density={density}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        maxWidth: "540px",
        padding: "var(--space-6)",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text)" }}>
            Liquidity Buffer Allocation
          </h3>
          <p style={{ margin: "var(--space-0-5) 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Treasury allocation controls with real-time numeric readouts
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-1)" }}>
          {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDensity(d)}
              style={{
                fontSize: "var(--type-micro, 11px)",
                padding: "2px 6px",
                background: density === d ? "var(--color-primary)" : "var(--color-bg-sunken)",
                color: density === d ? "var(--color-bg-elevated)" : "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
              }}
            >
              {d === "ultra-compact" ? "24px" : d === "compact" ? "28px" : d === "standard" ? "32px" : "40px"}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          padding: "var(--space-4)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-text)" }}>
              Tier 1 Cash Buffer Target
            </label>
            <span style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)" }}>
              Recommended: 25% - 40%
            </span>
          </div>
          <Slider
            value={reserveRatio}
            onChange={setReserveRatio}
            min={5}
            max={75}
            step={1}
            showValue
            valueFormatter={(v) => `${v}%`}
            density={density}
            aria-label="Tier 1 cash buffer target"
          />
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-1)" }}>
            <label style={{ fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-text)" }}>
              SOFR Overnight Margin Spread
            </label>
            <span style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)" }}>
              Fixed spread: 0.25% - 5.00%
            </span>
          </div>
          <Slider
            value={interestSpread}
            onChange={setInterestSpread}
            min={0.25}
            max={5.0}
            step={0.25}
            showValue
            valueFormatter={(v) => `${v.toFixed(2)}%`}
            density={density}
            aria-label="SOFR overnight margin spread"
          />
        </div>
      </div>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 slider reference",
  render: () => <ReserveAllocationWorkbench />,
  parameters: { controls: { disable: true } },
};

export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "var(--space-4, 16px)",
        padding: "var(--space-4, 16px)",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          1. Continuous Slider with Readout
        </div>
        <Slider value={45} showValue aria-label="Continuous percentage" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Stepped Snap Points (Step = 25)
        </div>
        <Slider value={50} min={0} max={100} step={25} showValue aria-label="Stepped value" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          3. Disabled State
        </div>
        <Slider value={70} disabled showValue aria-label="Disabled slider" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          4. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Ultra-Compact (24px)
            </div>
            <Slider density="ultra-compact" value={20} showValue aria-label="Ultra-compact" />
          </div>
          <div data-density="compact">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Compact (28px)
            </div>
            <Slider density="compact" value={40} showValue aria-label="Compact" />
          </div>
          <div data-density="standard">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Standard (32px)
            </div>
            <Slider density="standard" value={60} showValue aria-label="Standard" />
          </div>
          <div data-density="comfortable">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Comfortable (40px)
            </div>
            <Slider density="comfortable" value={80} showValue aria-label="Comfortable" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState(60);
    return <Slider value={val} onChange={setVal} showValue aria-label="Percentage" />;
  },
};
