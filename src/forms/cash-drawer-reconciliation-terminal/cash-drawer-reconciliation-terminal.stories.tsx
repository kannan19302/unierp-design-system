import type { Meta, StoryObj } from "@storybook/react";
import { CashDrawerReconciliationTerminal } from "./cash-drawer-reconciliation-terminal";

const meta: Meta<typeof CashDrawerReconciliationTerminal> = {
  title: "Forms/CashDrawerReconciliationTerminal",
  component: CashDrawerReconciliationTerminal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CashDrawerReconciliationTerminal>;

const mockShift = {
  shiftId: "SHIFT-2026-0906-M",
  terminalId: "POS-LANE-04",
  cashierName: "Elena Rostova",
  openingFloat: 300.0,
  posCashSales: 1485.5,
  cashPaidOut: -200.0,
};

export const Default: Story = {
  args: {
    shiftContext: mockShift,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    shiftContext: mockShift,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    shiftContext: mockShift,
    density: "comfortable",
  },
};
