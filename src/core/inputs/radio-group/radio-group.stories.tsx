import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, type RadioGroupProps, type RadioOption } from "./radio-group";

/**
 * ## Strata V1 RadioGroup Primitive
 *
 * Accessible single-selection radio button group engineered to the SideNav V1 reference standard:
 * - **W3C Radiogroup Pattern**: Full native keyboard arrow navigation and accessible label association.
 * - **Rich Option Anatomy**: Supports primary labels alongside secondary explanatory hint notes.
 * - **4-Tier Density**: `ultra-compact` (14px), `compact` (15px), `standard` (16px), `comfortable` (18px).
 * - **Flexible Orientations**: Stacked vertical flow or inline horizontal layout.
 */
const meta: Meta<typeof RadioGroup> = {
  title: "Core/Inputs/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise mutually exclusive selection group with rich label/hint metadata, vertical/horizontal orientations, and density support.",
      },
    },
  },
  argTypes: {
    value: { control: "text", description: "Currently selected option value." },
    orientation: { control: "select", options: ["vertical", "horizontal"], description: "Layout direction." },
    disabled: { control: "boolean", description: "Disables interaction for the entire radio group." },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

const INVENTORY_OPTIONS: RadioOption[] = [
  { value: "fifo", label: "FIFO (First In, First Out)", hint: "Standard cost valuation recommended for GAAP / IFRS" },
  { value: "lifo", label: "LIFO (Last In, First Out)", hint: "Tax optimization in eligible North American jurisdictions" },
  { value: "wac", label: "Weighted Average Cost", hint: "Continuous weighted inventory asset tracking" },
  { value: "specific", label: "Specific Identification", hint: "High-value serialized capital equipment only", disabled: true },
];

function AccountingMethodWorkbench() {
  const [val, setVal] = useState("fifo");
  const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");

  return (
    <div
      data-density={density}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        maxWidth: "580px",
        padding: "var(--space-6)",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text)" }}>
            Inventory Costing Methodology
          </h3>
          <p style={{ margin: "var(--space-0-5) 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Selected: <strong style={{ color: "var(--color-text)" }}>{val.toUpperCase()}</strong>
          </p>
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            type="button"
            onClick={() => setOrientation((o) => (o === "vertical" ? "horizontal" : "vertical"))}
            style={{
              fontSize: "var(--type-micro, 11px)",
              padding: "2px 8px",
              background: "var(--color-bg-sunken)",
              color: "var(--color-text)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            {orientation === "vertical" ? "Vertical" : "Horizontal"}
          </button>

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
          padding: "var(--space-4)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        <RadioGroup
          options={INVENTORY_OPTIONS}
          value={val}
          onChange={setVal}
          orientation={orientation}
          density={density}
        />
      </div>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 radio group reference",
  render: () => <AccountingMethodWorkbench />,
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
          1. Vertical Stack
        </div>
        <RadioGroup
          value="a"
          options={[
            { value: "a", label: "Automated ACH Transfer", hint: "1-2 business days settlement" },
            { value: "b", label: "Fedwire Wire Transfer", hint: "Same-day real-time clearing" },
          ]}
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Horizontal Flow
        </div>
        <RadioGroup
          orientation="horizontal"
          value="monthly"
          options={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          3. Entire Group Disabled
        </div>
        <RadioGroup
          disabled
          value="opt1"
          options={[
            { value: "opt1", label: "Default Option (Locked)" },
            { value: "opt2", label: "Secondary Option (Locked)" },
          ]}
        />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          4. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact">
            <RadioGroup
              density="ultra-compact"
              value="1"
              options={[{ value: "1", label: "Ultra-Compact (14px)" }]}
            />
          </div>
          <div data-density="compact">
            <RadioGroup
              density="compact"
              value="1"
              options={[{ value: "1", label: "Compact (15px)" }]}
            />
          </div>
          <div data-density="standard">
            <RadioGroup
              density="standard"
              value="1"
              options={[{ value: "1", label: "Standard (16px)" }]}
            />
          </div>
          <div data-density="comfortable">
            <RadioGroup
              density="comfortable"
              value="1"
              options={[{ value: "1", label: "Comfortable (18px)" }]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Default: Story = {
  args: {
    value: "fifo",
    options: INVENTORY_OPTIONS,
  },
};
