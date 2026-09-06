import type { Meta, StoryObj } from "@storybook/react";
import { CashSweepLiquidityOptimizer } from "./cash-sweep-liquidity-optimizer";

const meta: Meta<typeof CashSweepLiquidityOptimizer> = {
  title: "Workflow/CashSweepLiquidityOptimizer",
  component: CashSweepLiquidityOptimizer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CashSweepLiquidityOptimizer>;

const mockAccounts = [
  {
    id: "acc-100",
    accountName: "JPMorgan Master Concentration Hub",
    accountNumberMask: "•••• 4410",
    accountType: "CONCENTRATION" as const,
    currency: "USD",
    currentBalance: 42500000,
    targetFloorBalance: 15000000,
    apyRate: 5.25,
  },
  {
    id: "acc-101",
    accountName: "Silicon Valley Operating Checking",
    accountNumberMask: "•••• 8921",
    accountType: "OPERATING" as const,
    currency: "USD",
    currentBalance: 18450000,
    targetFloorBalance: 5000000,
    apyRate: 0.15,
  },
  {
    id: "acc-102",
    accountName: "Bi-Weekly Corporate Payroll Reserve",
    accountNumberMask: "•••• 3190",
    accountType: "PAYROLL_RESERVE" as const,
    currency: "USD",
    currentBalance: 2100000,
    targetFloorBalance: 4500000,
    apyRate: 1.1,
  },
  {
    id: "acc-103",
    accountName: "Morgan Stanley Government MMF Sweep",
    accountNumberMask: "•••• 7720",
    accountType: "HIGH_YIELD_SWEEP" as const,
    currency: "USD",
    currentBalance: 85000000,
    targetFloorBalance: 50000000,
    apyRate: 5.38,
  },
];

export const Default: Story = {
  args: {
    accounts: mockAccounts,
    masterPoolAccountId: "acc-100",
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    accounts: mockAccounts,
    masterPoolAccountId: "acc-100",
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    accounts: mockAccounts,
    masterPoolAccountId: "acc-100",
    density: "comfortable",
  },
};
