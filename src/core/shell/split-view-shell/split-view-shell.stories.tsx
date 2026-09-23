import type { Meta, StoryObj } from "@storybook/react";
import { SplitViewShell } from "./split-view-shell";
import { Badge } from "../../primitives/badge";
import { Button } from "../../primitives/button";

const meta: Meta<typeof SplitViewShell> = {
  title: "Core/Shell/SplitViewShell",
  component: SplitViewShell,
  tags: ["autodocs"],
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
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof SplitViewShell>;

export const Default: Story = {
  args: {
    masterHeader: <span style={{ fontWeight: "var(--font-weight-semibold)" }}>Incident Queue (14)</span>,
    masterContent: (
      <div>
        <div style={{ padding: "var(--space-3)", borderBlockEnd: "1px solid var(--color-border)", background: "var(--color-bg-elevated)" }}>
          <strong>INC-1092</strong> - Payment gateway timeout
        </div>
        <div style={{ padding: "var(--space-3)", borderBlockEnd: "1px solid var(--color-border)" }}>
          <strong>INC-1093</strong> - High CPU on DB replica
        </div>
      </div>
    ),
    detailContent: (
      <div style={{ padding: "var(--space-6)" }}>
        <h2 style={{ margin: "0 0 var(--space-2) 0" }}>INC-1092 Details</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Telemetry reports 504 gateway timeout on webhook ingestion.</p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "450px" }}>
      <SplitViewShell
        masterWidth={320}
        masterHeader={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <span style={{ fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-sm)" }}>Accounts Receivable Queue</span>
            <Badge variant="warning">4 Overdue</Badge>
          </div>
        }
        masterContent={
          <div>
            <div style={{ padding: "var(--space-3)", borderBlockEnd: "1px solid var(--color-border)", background: "var(--color-bg-surface-selected)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "var(--font-weight-semibold)" }}>INV-2026-004</span>
                <span style={{ color: "var(--color-danger)" }}>$42,500.00</span>
              </div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Acme Global Corp · 14d overdue</div>
            </div>
            <div style={{ padding: "var(--space-3)", borderBlockEnd: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "var(--font-weight-semibold)" }}>INV-2026-005</span>
                <span>$8,120.00</span>
              </div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Starlight Media · 3d overdue</div>
            </div>
          </div>
        }
        detailContent={
          <div style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: 0 }}>Invoice INV-2026-004</h2>
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>Issued 2026-08-15 · Due 2026-09-01</span>
              </div>
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="secondary" size="sm">Send Reminder</Button>
                <Button variant="primary" size="sm">Record Payment</Button>
              </div>
            </div>
            <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-4)", background: "var(--color-bg-surface)" }}>
              <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Ledger Reconciliation</h4>
              <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>Debit: 1100 Accounts Receivable ($42,500.00) | Credit: 4000 Revenue ($42,500.00)</p>
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
          1. Populated Active Queue State
        </h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)" }}>
          <SplitViewShell
            masterWidth={280}
            masterHeader={<span>Active Batches (3)</span>}
            masterContent={
              <div style={{ padding: "var(--space-3)" }}>
                <strong>BATCH-789</strong> · Ready for settlement
              </div>
            }
            detailContent={
              <div style={{ padding: "var(--space-4)" }}>
                <h3>Batch BATCH-789</h3>
                <p>128 transactions aggregated. Total payout: $214,890.00.</p>
              </div>
            }
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Empty Master Queue State
        </h4>
        <div style={{ height: "240px", border: "1px solid var(--color-border)" }}>
          <SplitViewShell
            masterWidth={280}
            masterHeader={<span>Triage Queue (0)</span>}
            masterContent={
              <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-tertiary)" }}>
                All clear. No pending review items.
              </div>
            }
            detailContent={
              <div style={{ padding: "var(--space-6)", textAlign: "center", color: "var(--color-text-tertiary)" }}>
                Select an item from the master queue to review details.
              </div>
            }
          />
        </div>
      </div>
    </div>
  ),
};
