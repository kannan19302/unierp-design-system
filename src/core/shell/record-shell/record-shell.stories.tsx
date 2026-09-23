import type { Meta, StoryObj } from "@storybook/react";
import { RecordShell, ObjectPage, type ObjectSection } from "./record-shell";
import { MeridianBar } from "../meridian-bar";
import { Button } from "../../primitives/button";
import { Badge } from "../../primitives/badge";

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
  title: "Core/Shell/RecordShell",
  component: RecordShell,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    railCollapsed: { control: "boolean" },
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
        action={{ label: "Approve Record", onClick: () => {} }}
      />
    ),
    list: (
      <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0 }}>Invoices</h4>
        <div style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-sm)" }}>
          <strong>INV-2026-99</strong><br />$14,200.00
        </div>
        <div style={{ padding: "var(--space-2)" }}>
          <strong>INV-2026-98</strong><br />$8,400.00
        </div>
      </div>
    ),
    detail: <ObjectPage sections={MOCK_SECTIONS} activeId="general" />,
    inspector: (
      <div style={{ padding: "var(--space-4)" }}>
        <h4>Record Inspector</h4>
        <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Linked PO: PO-8819</p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "550px" }}>
      <RecordShell
        rail={
          <div style={{ padding: "var(--space-4)", width: "180px", fontSize: "var(--font-size-sm)" }}>
            <div style={{ fontWeight: "var(--font-weight-semibold)", marginBlockEnd: "var(--space-2)" }}>MODULES</div>
            <div>• Sales Orders</div>
            <div>• <strong>Invoices</strong></div>
            <div>• Customers</div>
          </div>
        }
        bar={
          <div style={{ padding: "var(--space-2) var(--space-4)", borderBlockEnd: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
              <span>finance / ar / <strong>INV-2026-99</strong></span>
              <Badge variant="warning">Under Review</Badge>
            </div>
            <Button variant="primary" size="sm">Approve</Button>
          </div>
        }
        list={
          <div style={{ padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            <div style={{ padding: "var(--space-2-5)", background: "var(--color-bg-surface-selected)", borderRadius: "var(--radius-sm)" }}>
              <strong>INV-2026-99</strong><br />
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>$14,200.00 · Acme Global</span>
            </div>
          </div>
        }
        detail={
          <div style={{ padding: "var(--space-4)" }}>
            <h3 style={{ margin: "0 0 var(--space-2) 0" }}>Invoice INV-2026-99 Details</h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
              Line items, taxes, shipping addresses, and payment history displayed here.
            </p>
          </div>
        }
        inspector={
          <div style={{ padding: "var(--space-4)" }}>
            <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Audit History</h4>
            <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
              10:14 AM - Created by Billing Clerk<br />
              10:20 AM - Tax Calculated via Avalara
            </div>
          </div>
        }
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Three-Column Populated Layout
        </h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)" }}>
          <RecordShell
            list={<div style={{ padding: "var(--space-3)" }}>Record List Column</div>}
            detail={<div style={{ padding: "var(--space-3)" }}>Record Details Column</div>}
            inspector={<div style={{ padding: "var(--space-3)" }}>Inspector Column</div>}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Two-Column Layout (List + Detail, No Inspector)
        </h4>
        <div style={{ height: "240px", border: "1px solid var(--color-border)" }}>
          <RecordShell
            list={<div style={{ padding: "var(--space-3)" }}>Compact Master List</div>}
            detail={<div style={{ padding: "var(--space-3)" }}>Full Measure Record Detail Workspace</div>}
          />
        </div>
      </div>
    </div>
  ),
};
