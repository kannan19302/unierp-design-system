import type { Meta, StoryObj } from "@storybook/react";
import { InspectorShell } from "./inspector-shell";

const meta: Meta<typeof InspectorShell> = {
  title: "Shell/InspectorShell",
  component: InspectorShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof InspectorShell>;

export const Default: Story = {
  args: {
    topBar: (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <h3 style={{ margin: 0 }}>Order Management Workspace</h3>
        <button style={{ padding: "6px 12px", background: "var(--color-brand, #3b82f6)", color: "#fff", border: "none", borderRadius: "4px" }}>+ Create Order</button>
      </div>
    ),
    list: (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ padding: "var(--space-3)", background: "var(--color-surface-elevated, #fff)", border: "1px solid var(--color-border-default, #e2e8f0)", borderRadius: "var(--radius-md)" }}>
            <strong>ORD-2026-00{i}</strong>
            <p style={{ margin: "4px 0 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              Acme Logistics • $14,200.00
            </p>
          </div>
        ))}
      </div>
    ),
    inspector: (
      <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <h4 style={{ margin: 0 }}>Order Inspector: ORD-2026-001</h4>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Customer: Acme Logistics Inc.<br />
          Status: Verified & Pending Delivery<br />
          Payment: Net 30
        </p>
        <button style={{ padding: "8px", background: "var(--color-brand, #3b82f6)", color: "#fff", border: "none", borderRadius: "4px" }}>
          Approve Dispatch
        </button>
      </div>
    ),
  },
};
