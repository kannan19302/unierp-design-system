import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker, type DatePickerProps } from "./date-picker";

/**
 * ## DatePicker Primitive
 *
 * Integrated date field pairing a calendar prefix glyph with native browser date pickers,
 * boundary clamping (`minDate`, `maxDate`), and accessible error validation.
 *
 * ### Key Capabilities
 * - **ISO 8601 Format**: Guarantees standard `YYYY-MM-DD` interoperability across all ERP endpoints.
 * - **Boundary Enforcement**: Restricts selectable dates via `minDate` and `maxDate`.
 * - **Accessible Calendar Trigger**: Integrated calendar icon for immediate visual affordance.
 */
const meta: Meta<typeof DatePicker> = {
  title: "Core/Inputs/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise date input with calendar prefix icon, ISO date formatting, boundary clamping, and density scaling.",
      },
    },
  },
  argTypes: {
    value: { control: "text", description: "ISO 8601 date string (YYYY-MM-DD)." },
    minDate: { control: "text", description: "Earliest selectable date (YYYY-MM-DD)." },
    maxDate: { control: "text", description: "Latest selectable date (YYYY-MM-DD)." },
    disabled: { control: "boolean", description: "Disables interaction and applies muted styling." },
    invalid: { control: "boolean", description: "Applies error border and sets aria-invalid." },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

function InteractiveDatePicker(props: Partial<DatePickerProps>) {
  const [val, setVal] = useState(props.value ?? "2026-08-29");
  return <DatePicker value={val} onChange={setVal} {...props} />;
}

export const Default: Story = {
  render: () => <InteractiveDatePicker />,
};

export const RestrictedRange: Story = {
  render: () => (
    <InteractiveDatePicker
      minDate="2026-01-01"
      maxDate="2026-12-31"
      value="2026-06-15"
    />
  ),
};

/**
 * Exploded sub-component anatomy and compound composition story.
 */
export const AnatomyAndComposition = () => {
  const [start, setStart] = useState("2026-09-01");
  const [end, setEnd] = useState("2026-09-30");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Fiscal Accounting Period Span
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Period Opening Date
            </label>
            <DatePicker value={start} onChange={setStart} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", marginBottom: "var(--space-1)", color: "var(--color-text-secondary)" }}>
              Period Closing Date
            </label>
            <DatePicker value={end} onChange={setEnd} minDate={start} />
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
        Core Date Picker States
      </h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Empty / Unset</span>
          <DatePicker value="" />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Populated Date</span>
          <DatePicker value="2026-09-19" />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Out of Fiscal Range (Invalid)</span>
          <DatePicker value="2024-01-01" invalid />
        </div>
        <div>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Disabled Historical Record</span>
          <DatePicker value="2025-12-31" disabled />
        </div>
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        4-Tier Ergonomic Density Matrix
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DatePicker value="2026-09-19" />
        </div>
        <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DatePicker value="2026-09-19" />
        </div>
        <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DatePicker value="2026-09-19" />
        </div>
        <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
          <DatePicker value="2026-09-19" />
        </div>
      </div>
    </div>
  </div>
);

export const V1WorkspacePreview = () => {
  const [invoiceDate, setInvoiceDate] = useState("2026-09-23");
  const [dueDate, setDueDate] = useState("2026-10-23");

  return (
    <div style={{ padding: "var(--space-6)", background: "var(--color-bg-canvas)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "560px" }}>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
          Commercial Invoice Billing Schedule
        </h3>
        <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Set issuance and payment due dates conforming to corporate credit policy.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
        <DatePicker
          label="Invoice Issuance Date"
          value={invoiceDate}
          onChange={setInvoiceDate}
          density="standard"
          required
        />
        <DatePicker
          label="Net-30 Due Date"
          value={dueDate}
          onChange={setDueDate}
          minDate={invoiceDate}
          density="standard"
          required
        />
      </div>

      <div style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Payment terms: Net 30 days from billing date
        </span>
      </div>
    </div>
  );
};

export const StateMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "480px" }}>
    <DatePicker label="Default Populated Date" value="2026-09-23" />
    <DatePicker label="Invalid / Out-of-Range Date" value="2024-01-01" invalid error="Date is prior to open accounting fiscal year" />
    <DatePicker label="Disabled Locked Record" value="2025-12-31" disabled />
  </div>
);

