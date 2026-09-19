import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InlineEdit, type InlineEditProps } from "./inline-edit";

/**
 * ## InlineEdit Primitive
 *
 * Click-to-edit inline record input engineered for high-density tables, account profile headers,
 * invoice line item annotations, and live entity renaming.
 *
 * ### Key Capabilities
 * - **Seamless In-Place Transition**: Renders as plain high-contrast text until clicked or focused.
 * - **Keyboard Velocity**: `Enter` to commit, `Escape` to discard modifications.
 * - **Asynchronous Persistence**: Supports Promise-based `onSave` with inline loading disablement.
 * - **Validation Feedback**: Inline validation error rendering below the input field.
 */
const meta: Meta<typeof InlineEdit> = {
  title: "Inputs/InlineEdit",
  component: InlineEdit,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise in-place editor with seamless click-to-edit behavior, Enter/Escape keyboard bindings, and validation.",
      },
    },
  },
  argTypes: {
    label: { control: "text", description: "Contextual label rendered above the editable value." },
    value: { control: "text", description: "Current committed text value." },
    placeholder: { control: "text", description: "Placeholder displayed when value is empty." },
    disabled: { control: "boolean", description: "Prevents entering edit mode." },
  },
};

export default meta;
type Story = StoryObj<typeof InlineEdit>;

function InteractiveInlineEdit(props: Partial<InlineEditProps>) {
  const [val, setVal] = useState(props.value ?? "Acme Global Manufacturing Corp");
  return (
    <InlineEdit
      label="Account Entity Name"
      value={val}
      onSave={(next) => setVal(next)}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveInlineEdit />,
};

export const Empty: Story = {
  render: () => (
    <InlineEdit
      label="Purchase Order Internal Note"
      value=""
      placeholder="Click to attach note..."
      onSave={() => {}}
    />
  ),
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [title, setTitle] = useState("Q3 Financial Reconciliation Master");
  const [sku, setSku] = useState("GL-8092-EUR");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          General Ledger Record Header
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <InlineEdit
            label="Record Name"
            value={title}
            onSave={(next) => setTitle(next)}
            validate={(val) => (val.trim().length < 3 ? "Record name must be at least 3 characters" : null)}
          />
          <InlineEdit
            label="Internal General Ledger Identifier"
            value={sku}
            onSave={(next) => setSku(next)}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * All States Gallery rendering all lifecycle, editing, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Display & Placeholder States
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <InlineEdit label="Standard Committed Record" value="Enterprise Plan Tier 4" onSave={() => {}} />
        <InlineEdit label="Empty (Click to add)" value="" placeholder="Add internal description..." onSave={() => {}} />
        <InlineEdit label="Disabled / Locked by Audit Policy" value="LOCKED-GL-2026" disabled onSave={() => {}} />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <InlineEdit label="Ultra-Compact (24px) Cell Edit" value="GL-10492" onSave={() => {}} />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <InlineEdit label="Compact (28px) Row Edit" value="Accounts Payable Entry" onSave={() => {}} />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <InlineEdit label="Standard (32px) Record Edit" value="North American Operations" onSave={() => {}} />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <InlineEdit label="Comfortable (40px) Touch Edit" value="Store POS Terminal 04" onSave={() => {}} />
        </div>
      </div>
    </div>
  </div>
);
