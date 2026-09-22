import type { Meta, StoryObj } from "@storybook/react";
import { InspectorShell } from "./inspector-shell";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof InspectorShell> = {
  title: "Shell/InspectorShell",
  component: InspectorShell,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "landmark-one-main", enabled: false },
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
    inspectorOpen: { control: "boolean" },
    navigationCollapsed: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof InspectorShell>;

export const Default: Story = {
  args: {
    topBar: (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "var(--space-2) var(--space-4)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--font-size-md)" }}>Order Management Workspace</h3>
        <Button variant="primary" size="sm">+ Create Order</Button>
      </div>
    ),
    list: (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", padding: "var(--space-4)" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ padding: "var(--space-3)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
            <strong>ORD-2026-00{i}</strong>
            <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
              Acme Logistics • $14,200.00
            </p>
          </div>
        ))}
      </div>
    ),
    inspector: (
      <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <h4 style={{ margin: 0 }}>Order Inspector: ORD-2026-001</h4>
        <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          Customer: Acme Logistics Inc.<br />
          Status: Verified & Pending Delivery<br />
          Payment: Net 30
        </p>
        <Button variant="primary" size="sm">Approve Dispatch</Button>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "550px" }}>
      <InspectorShell
        topBar={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "var(--space-2) var(--space-4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <span style={{ fontWeight: "var(--font-weight-semibold)" }}>Purchase Invoices Inspection</span>
              <Badge variant="warning">3 Pending Approval</Badge>
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button variant="secondary" size="sm">Filter</Button>
              <Button variant="primary" size="sm">Batch Post</Button>
            </div>
          </div>
        }
        navigation={
          <div style={{ padding: "var(--space-4)", width: "200px" }}>
            <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBlockEnd: "var(--space-2)" }}>
              INVOICE QUEUES
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "var(--font-size-sm)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <li><strong>All Invoices (84)</strong></li>
              <li>Needs Review (12)</li>
              <li>Pending Matching (5)</li>
              <li>Approved for Payment (67)</li>
            </ul>
          </div>
        }
        list={
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", padding: "var(--space-4)" }}>
            <div style={{ padding: "var(--space-3)", background: "var(--color-bg-surface-selected)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>PINV-2026-8910</strong>
                <Badge variant="warning">2-Way Match Review</Badge>
              </div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginBlockStart: "var(--space-1)" }}>
                Cloud Services Inc · $34,900.00 · Due in 5 days
              </div>
            </div>
            <div style={{ padding: "var(--space-3)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>PINV-2026-8911</strong>
                <Badge variant="success">Matched</Badge>
              </div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", marginBlockStart: "var(--space-1)" }}>
                Global Freight LLC · $11,250.00 · Due in 12 days
              </div>
            </div>
          </div>
        }
        inspectorOpen={true}
        inspector={
          <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <h4 style={{ margin: 0 }}>Record Inspector</h4>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>PINV-2026-8910 · PO-5542</span>
            </div>
            <div style={{ border: "1px solid var(--color-border)", padding: "var(--space-3)", borderRadius: "var(--radius-sm)", fontSize: "var(--font-size-xs)" }}>
              <strong>Match Discrepancy:</strong> PO amount $32,000.00 differs from invoice $34,900.00 (+9.06% variance requires supervisor sign-off).
            </div>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button variant="danger" size="sm">Reject</Button>
              <Button variant="primary" size="sm">Authorize Override</Button>
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
          1. Inspector Open State
        </h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)" }}>
          <InspectorShell
            list={<div style={{ padding: "var(--space-4)" }}>Working item list</div>}
            inspector={<div style={{ padding: "var(--space-4)" }}>Contextual Inspector details</div>}
            inspectorOpen={true}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Inspector Collapsed State (Full Width Table)
        </h4>
        <div style={{ height: "240px", border: "1px solid var(--color-border)" }}>
          <InspectorShell
            list={<div style={{ padding: "var(--space-4)" }}>Working item list spanning full width when inspector is collapsed.</div>}
            inspector={<div style={{ padding: "var(--space-4)" }}>Collapsed</div>}
            inspectorOpen={false}
          />
        </div>
      </div>
    </div>
  ),
};
