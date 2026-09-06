import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CashSweepLiquidityOptimizer } from "./cash-sweep-liquidity-optimizer";

const mockAccounts = [
  {
    id: "acc-100",
    accountName: "JPMorgan Master Hub",
    accountNumberMask: "•••• 4410",
    accountType: "CONCENTRATION" as const,
    currency: "USD",
    currentBalance: 30000000,
    targetFloorBalance: 10000000,
    apyRate: 5.25,
  },
  {
    id: "acc-101",
    accountName: "SVB Operating Checking",
    accountNumberMask: "•••• 8921",
    accountType: "OPERATING" as const,
    currency: "USD",
    currentBalance: 12000000,
    targetFloorBalance: 5000000,
    apyRate: 0.15,
  },
  {
    id: "acc-102",
    accountName: "Payroll Reserve",
    accountNumberMask: "•••• 3190",
    accountType: "PAYROLL_RESERVE" as const,
    currency: "USD",
    currentBalance: 2000000,
    targetFloorBalance: 4000000,
    apyRate: 1.1,
  },
];

describe("CashSweepLiquidityOptimizer", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <CashSweepLiquidityOptimizer accounts={mockAccounts} masterPoolAccountId="acc-100" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders header and account summary numbers", () => {
    render(
      <CashSweepLiquidityOptimizer accounts={mockAccounts} masterPoolAccountId="acc-100" />
    );
    expect(screen.getByText("Multi-Tier Cash Sweep & ZBA Liquidity Optimizer")).toBeInTheDocument();
    expect(screen.getByText("REBALANCE PROPOSAL READY")).toBeInTheDocument();
    expect(screen.getByText("JPMorgan Master Hub")).toBeInTheDocument();
    expect(screen.getByText("SVB Operating Checking")).toBeInTheDocument();
  });

  it("executes batch rebalance and triggers callback", () => {
    const handleExecute = vi.fn();
    render(
      <CashSweepLiquidityOptimizer
        accounts={mockAccounts}
        masterPoolAccountId="acc-100"
        onExecuteBatchSweep={handleExecute}
      />
    );

    const execBtn = screen.getByRole("button", { name: /authorize and execute cash sweep transfers/i });
    fireEvent.click(execBtn);

    expect(handleExecute).toHaveBeenCalledTimes(1);
    const transfers = handleExecute.mock.calls[0][0];
    expect(transfers.length).toBe(2);
    // Surplus from SVB Operating (12M - 5M = 7M)
    expect(transfers).toContainEqual({
      fromAccountId: "acc-101",
      toAccountId: "acc-100",
      amount: 7000000,
    });
    // Deficit for Payroll (4M - 2M = 2M)
    expect(transfers).toContainEqual({
      fromAccountId: "acc-100",
      toAccountId: "acc-102",
      amount: 2000000,
    });

    expect(screen.getByText("TRANSFERS DISPATCHED")).toBeInTheDocument();
    expect(screen.getByText("Sweeps Transferred")).toBeDisabled();
  });
});
