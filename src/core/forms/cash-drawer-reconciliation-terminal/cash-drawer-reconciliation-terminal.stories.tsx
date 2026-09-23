import type { Meta, StoryObj } from "@storybook/react";
import { CashDrawerReconciliationTerminal } from "./cash-drawer-reconciliation-terminal";

const mockShift = {
  shiftId: "SHIFT-2026-0906-M",
  terminalId: "POS-LANE-04",
  cashierName: "Elena Rostova",
  openingFloat: 300.0,
  posCashSales: 1485.5,
  cashPaidOut: -200.0,
};

const meta: Meta<typeof CashDrawerReconciliationTerminal> = {
  title: "Core/Forms/CashDrawerReconciliationTerminal",
  component: CashDrawerReconciliationTerminal,
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "label", enabled: true }],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Display density token",
    },
    shiftContext: {
      description: "Shift metadata (opening float, sales, paid-outs)",
    },
    onCommitCloseout: {
      action: "closeoutCommitted",
      description: "Callback invoked on finalized reconciliation",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CashDrawerReconciliationTerminal>;

export const Default: Story = {
  args: {
    shiftContext: mockShift,
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "52rem", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        CashDrawerReconciliationTerminal presents shift KPI summaries, dual-column denomination counting
        (bills and coins), real-time variance calculation, variance explanation handling, and closeout finalization.
      </p>
      <CashDrawerReconciliationTerminal
        shiftContext={mockShift}
        density="compact"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "54rem", display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Ultra-Compact Terminal Mode</h5>
        <CashDrawerReconciliationTerminal
          shiftContext={{
            shiftId: "SHIFT-EXP-01",
            terminalId: "KIOSK-02",
            cashierName: "Auto Kiosk",
            openingFloat: 100.0,
            posCashSales: 450.0,
            cashPaidOut: 0.0,
          }}
          density="ultra-compact"
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Standard Retail Shift (Comfortable)</h5>
        <CashDrawerReconciliationTerminal
          shiftContext={mockShift}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
