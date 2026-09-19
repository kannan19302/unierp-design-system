import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";

/**
 * ## Checkbox Primitive
 *
 * High-density accessible checkbox input engineered for enterprise ERP data tables,
 * batch actions, master triage trays, and administrative permission trees.
 *
 * ### Key Capabilities
 * - **Tri-State Support**: Seamlessly renders unchecked, checked, and indeterminate states.
 * - **Accessible Labeling**: Native `<label>` binding with `htmlFor` generated via `useId()`.
 * - **Keyboard Velocity**: Accessible focus rings and space-key toggle support.
 */
const meta: Meta<typeof Checkbox> = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Enterprise checkbox component supporting tri-state indeterminate selection, disabled states, and density scaling.",
      },
    },
  },
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled checked state boolean.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Uncontrolled initial checked state boolean.",
    },
    indeterminate: {
      control: "boolean",
      description: "Renders a minus dash indicating partial/mixed selection of children.",
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction and applies muted opacity styling.",
    },
    label: {
      control: "text",
      description: "Accessible text label associated with the checkbox.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

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

/**
 * Exploded anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "420px" }}>
    <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
      <div style={{ paddingBottom: "var(--space-3)", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-3)" }}>
        <Checkbox label="Select All Tax Groups (Batch Controller)" indeterminate />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", paddingInlineStart: "var(--space-4)" }}>
        <Checkbox label="State & Local Sales Tax (NY-802)" defaultChecked />
        <Checkbox label="Federal Excise & Customs (US-FED)" defaultChecked />
        <Checkbox label="Value Added Tax (EU-VAT-20)" />
        <Checkbox label="Harmonized Goods & Services (CA-HST)" disabled />
      </div>
    </div>
  </div>
);

/**
 * All States Gallery rendering all lifecycle, selection, and density variants.
 */
export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "560px" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Core Selection States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <Checkbox label="Unchecked (Default)" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate (Mixed)" indeterminate />
        <Checkbox label="Interactive Focus Visible" defaultChecked />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Disabled / Read-Only States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <Checkbox label="Disabled Unchecked" disabled />
        <Checkbox label="Disabled Checked" defaultChecked disabled />
        <Checkbox label="Disabled Indeterminate" indeterminate disabled />
        <Checkbox label="Mandatory Policy Check" defaultChecked disabled />
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Checkbox label="Ultra-Compact (24px row) Ledger Selection" defaultChecked />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Checkbox label="Compact (28px row) Operational Triage Check" defaultChecked />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Checkbox label="Standard (32px row) Form Field Check" defaultChecked />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <Checkbox label="Comfortable (40px row) POS / Touch Target" defaultChecked />
        </div>
      </div>
    </div>
  </div>
);
