import type { Meta, StoryObj } from "@storybook/react";
import { RecordShell, ObjectPage, type ObjectSection } from "./record-shell";
import { MeridianBar } from "../meridian-bar";

const MOCK_SECTIONS: ObjectSection[] = [
  {
    id: "general",
    label: "General Info",
    children: <p style={{ color: "var(--color-text-secondary)" }}>Invoice ID: INV-2026-99 • Customer: Acme Global • Terms: Net 30</p>,
  },
  {
    id: "line-items",
    label: "Line Items",
    children: <p style={{ color: "var(--color-text-secondary)" }}>10x Titanium Extrusions • $14,200.00</p>,
  },
  {
    id: "audit-trail",
    label: "Audit Trail",
    children: <p style={{ color: "var(--color-text-secondary)" }}>Created by clerk@acme.com on 2026-05-01</p>,
  },
];

const meta: Meta<typeof RecordShell> = {
  title: "Shell/RecordShell",
  component: RecordShell,
  parameters: { layout: "fullscreen" },
  argTypes: {
    bar: { control: false },
    list: { control: false },
    inspector: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof RecordShell>;

export const ThreePaneRecord: Story = {
  args: {
    bar: (
      <MeridianBar
        segments={[
          { label: "acme-corp" },
          { label: "finance" },
          { label: "invoices" },
          { label: "INV-2026-99" },
        ]}
        state={{ label: "Pending Approval", tone: "warning" }}
        action={{ label: "Approve Record", onClick: () => alert("Approved") }}
      />
    ),
    list: (
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <h4>Invoices</h4>
        <div style={{ padding: "8px", background: "var(--color-bg-sunken)", borderRadius: "4px" }}>
          <strong>INV-2026-99</strong><br />$14,200.00
        </div>
        <div style={{ padding: "8px" }}>
          <strong>INV-2026-98</strong><br />$8,400.00
        </div>
      </div>
    ),
    detail: (
      <div style={{ padding: "24px" }}>
        <ObjectPage sections={MOCK_SECTIONS} activeId="general" />
      </div>
    ),
    inspector: (
      <div style={{ padding: "16px" }}>
        <h4>Context Inspector</h4>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Linked Purchase Order: PO-88401<br />
          Vendor Tax ID: 94-2849102
        </p>
      </div>
    ),
  },
};
