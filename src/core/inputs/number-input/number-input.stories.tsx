import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NumberInput, type NumberInputProps } from "./number-input";
import { Hash, Percent } from "lucide-react";

/**
 * ## Strata V1 NumberInput Primitive
 *
 * Dedicated numerical input component engineered to the SideNav V1 reference standard:
 * - **Tabular Digits**: Guarantees vertical columnar numeric alignment (`tabular-nums lining-nums`).
 * - **Clamping on Blur**: Automatically ensures value remains within configured `min` and `max` bounds.
 * - **4-Tier Density**: `ultra-compact` (24px), `compact` (28px), `standard` (32px), `comfortable` (40px).
 * - **Slot Composition**: Prefix and suffix support for units and indicators.
 */
const meta: Meta<typeof NumberInput> = {
  title: "Core/Inputs/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise numerical input with tabular numbers, min/max clamping, validation styling, and density scaling.",
      },
    },
  },
  argTypes: {
    value: { control: "number", description: "Numerical value." },
    min: { control: "number", description: "Minimum allowable number." },
    max: { control: "number", description: "Maximum allowable number." },
    step: { control: "number", description: "Stepping increment for up/down navigation." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted opacity styling." },
    readOnly: { control: "boolean", description: "Renders in non-editable read-only state." },
    invalid: { control: "boolean", description: "Triggers error border and sets aria-invalid." },
    placeholder: { control: "text", description: "Placeholder string." },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

function InventoryAllocationWorkbench() {
  const [units, setUnits] = useState<number | undefined>(250);
  const [reorderPoint, setReorderPoint] = useState<number | undefined>(50);
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
            Warehouse Stock Allocation
          </h3>
          <p style={{ margin: "var(--space-0-5) 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            High-density tabular numerical precision with boundary clamping
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
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-4)",
          padding: "var(--space-4)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, marginBottom: "var(--space-1)", color: "var(--color-text)" }}>
            Dispatch Quantity (1 - 1000)
          </label>
          <NumberInput
            value={units}
            onChange={setUnits}
            min={1}
            max={1000}
            step={10}
            density={density}
            prefix={<Hash size={13} />}
            suffix={<span style={{ fontSize: "var(--type-micro, 11px)" }}>units</span>}
            aria-label="Dispatch quantity"
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 500, marginBottom: "var(--space-1)", color: "var(--color-text)" }}>
            Reorder Par Level (10 - 200)
          </label>
          <NumberInput
            value={reorderPoint}
            onChange={setReorderPoint}
            min={10}
            max={200}
            step={5}
            density={density}
            prefix={<Hash size={13} />}
            suffix={<span style={{ fontSize: "var(--type-micro, 11px)" }}>units</span>}
            aria-label="Reorder par level"
          />
        </div>
      </div>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 number input reference",
  render: () => <InventoryAllocationWorkbench />,
  parameters: { controls: { disable: true } },
};

export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "var(--space-4, 16px)",
        padding: "var(--space-4, 16px)",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          1. Default Empty
        </div>
        <NumberInput placeholder="Enter quantity..." aria-label="Default" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Populated with Slots
        </div>
        <NumberInput
          value={1250}
          prefix={<Hash size={13} />}
          suffix={<span style={{ fontSize: "var(--type-micro, 11px)" }}>pcs</span>}
          aria-label="Populated"
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-danger)" }}>
          3. Invalid Bounds State
        </div>
        <NumberInput invalid value={9999} aria-label="Invalid" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          4. Disabled / Read-Only
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <NumberInput disabled value={42} aria-label="Disabled" />
          <NumberInput readOnly value={100} aria-label="ReadOnly" />
        </div>
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          5. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Ultra-Compact (24px)
            </div>
            <NumberInput density="ultra-compact" value={10} aria-label="Ultra-compact" />
          </div>
          <div data-density="compact">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Compact (28px)
            </div>
            <NumberInput density="compact" value={20} aria-label="Compact" />
          </div>
          <div data-density="standard">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Standard (32px)
            </div>
            <NumberInput density="standard" value={30} aria-label="Standard" />
          </div>
          <div data-density="comfortable">
            <div style={{ fontSize: "var(--type-micro, 11px)", color: "var(--color-text-muted)", marginBottom: "4px" }}>
              Comfortable (40px)
            </div>
            <NumberInput density="comfortable" value={40} aria-label="Comfortable" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState<number | undefined>(42);
    return <NumberInput value={val} onChange={setVal} placeholder="0" aria-label="Number" />;
  },
};
