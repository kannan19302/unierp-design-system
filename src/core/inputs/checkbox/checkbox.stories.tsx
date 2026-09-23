import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox, type CheckboxProps } from "./checkbox";

/**
 * ## Strata V1 Checkbox Primitive
 *
 * High-density accessible checkbox engineered to the SideNav V1 reference standard:
 * - **Tri-State Support**: Seamlessly renders unchecked, checked, and indeterminate states.
 * - **4-Tier Density**: `ultra-compact` (14px), `compact` (15px), `standard` (16px), `comfortable` (18px).
 * - **Accessible Bindings**: Native `<label>` binding with `htmlFor` generated via `useId()`.
 * - **Keyboard Velocity**: Accessible focus rings and space-key toggle support.
 */
const meta: Meta<typeof Checkbox> = {
  title: "Core/Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise checkbox component supporting tri-state indeterminate selection, disabled states, and density scaling.",
      },
    },
  },
  argTypes: {
    checked: { control: "boolean", description: "Controlled checked state boolean." },
    defaultChecked: { control: "boolean", description: "Uncontrolled initial checked state boolean." },
    indeterminate: { control: "boolean", description: "Renders minus dash indicating partial/mixed selection." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted opacity styling." },
    invalid: { control: "boolean", description: "Applies error validation styling and aria-invalid." },
    label: { control: "text", description: "Accessible text label associated with the checkbox." },
    description: { control: "text", description: "Secondary assistive description text." },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

function BatchSelectionWorkbench() {
  const [selectedItems, setSelectedItems] = useState<string[]>(["tx-01", "tx-02"]);
  const [density, setDensity] = useState<"ultra-compact" | "compact" | "standard" | "comfortable">("standard");

  const items = [
    { id: "tx-01", label: "Invoice INV-2026-001 — Siemens Industrial ($48,250.00)", desc: "Due Net 30, verified match" },
    { id: "tx-02", label: "Invoice INV-2026-002 — BASF Chemicals ($12,400.00)", desc: "Pending tax review" },
    { id: "tx-03", label: "Invoice INV-2026-003 — SAP SE Cloud ($31,800.00)", desc: "Ready for clearing" },
    { id: "tx-04", label: "Invoice INV-2026-004 — Oracle Cloud Services ($9,150.00)", desc: "Scheduled for ACH" },
  ];

  const allSelected = items.length === selectedItems.length;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  const handleMasterToggle = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((i) => i.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemToggle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i !== id));
    }
  };

  return (
    <div
      data-density={density}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
        maxWidth: "560px",
        padding: "var(--space-6)",
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text)" }}>
            Batch Settlement Triage
          </h3>
          <p style={{ margin: "var(--space-0-5) 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            {selectedItems.length} of {items.length} disbursements selected
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
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          background: "var(--color-bg-elevated)",
        }}
      >
        <div
          style={{
            padding: "var(--space-3)",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-bg-sunken)",
          }}
        >
          <Checkbox
            label="Select All Invoice Batches"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={handleMasterToggle}
            density={density}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", padding: "var(--space-3)", gap: "var(--space-3)" }}>
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              description={item.desc}
              checked={selectedItems.includes(item.id)}
              onChange={(c) => handleItemToggle(item.id, c)}
              density={density}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export const V1WorkspacePreview: Story = {
  name: "V1 checkbox reference",
  render: () => <BatchSelectionWorkbench />,
  parameters: { controls: { disable: true } },
};

export const StateMatrix: Story = {
  name: "V1 state matrix",
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "var(--space-4, 16px)",
        padding: "var(--space-4, 16px)",
        background: "var(--color-bg)",
      }}
    >
      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          1. Unchecked (Default)
        </div>
        <Checkbox label="Enable Two-Factor Authentication" />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          2. Checked
        </div>
        <Checkbox label="Enforce TLS 1.3 Transport Encryption" defaultChecked />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text)" }}>
          3. Indeterminate (Mixed)
        </div>
        <Checkbox label="Permission Scope (3 of 8 selected)" indeterminate />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-danger)" }}>
          4. Invalid / Required
        </div>
        <Checkbox label="I agree to Master Services Agreement" invalid />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          5. Disabled Unchecked
        </div>
        <Checkbox label="Legacy SAML 1.1 Support" disabled />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-2)", color: "var(--color-text-muted)" }}>
          6. Disabled Checked
        </div>
        <Checkbox label="SOC2 Continuous Compliance Logging" defaultChecked disabled />
      </div>

      <div style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", gridColumn: "1 / -1" }}>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-3)", color: "var(--color-text)" }}>
          7. 4-Tier Ergonomic Density Matrix (ADR-0009)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact">
            <Checkbox density="ultra-compact" label="Ultra-Compact (14px)" defaultChecked />
          </div>
          <div data-density="compact">
            <Checkbox density="compact" label="Compact (15px)" defaultChecked />
          </div>
          <div data-density="standard">
            <Checkbox density="standard" label="Standard (16px)" defaultChecked />
          </div>
          <div data-density="comfortable">
            <Checkbox density="comfortable" label="Comfortable (18px)" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen", controls: { disable: true } },
};

export const Default: Story = {
  args: {
    label: "Select all invoice ledger rows",
    defaultChecked: false,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Partially selected journal entries (14 of 30 selected)",
    indeterminate: true,
  },
};
