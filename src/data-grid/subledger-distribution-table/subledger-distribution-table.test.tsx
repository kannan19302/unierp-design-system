import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SubledgerDistributionTable } from "./subledger-distribution-table";
import type { AccountOption, DistributionRow } from "./subledger-distribution-table";

const mockAccounts: AccountOption[] = [
  { id: "acc-1", code: "1010", name: "Cash" },
  { id: "acc-2", code: "2010", name: "AP" },
];

const balancedRows: DistributionRow[] = [
  {
    id: "r-1",
    accountId: "acc-1",
    debit: 100,
    credit: 0,
  },
  {
    id: "r-2",
    accountId: "acc-2",
    debit: 0,
    credit: 100,
  },
];

const unbalancedRows: DistributionRow[] = [
  {
    id: "r-1",
    accountId: "acc-1",
    debit: 150,
    credit: 0,
  },
  {
    id: "r-2",
    accountId: "acc-2",
    debit: 0,
    credit: 100,
  },
];

describe("SubledgerDistributionTable", () => {
  it("renders distribution table and indicates balanced state", () => {
    render(
      <SubledgerDistributionTable
        initialRows={balancedRows}
        availableAccounts={mockAccounts}
      />
    );

    expect(screen.getByText("General Ledger Account Distribution")).toBeInTheDocument();
    expect(screen.getByText(/Balanced: \$0.00 Difference/i)).toBeInTheDocument();
    expect(screen.getAllByText("$100.00").length).toBe(2);
  });

  it("identifies unbalanced vouchers and displays variance", () => {
    render(
      <SubledgerDistributionTable
        initialRows={unbalancedRows}
        availableAccounts={mockAccounts}
      />
    );

    expect(screen.getByText(/Out of Balance: \$50.00 Difference/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Balance Remainder/i })).toBeInTheDocument();
  });

  it("adds an offset line to balance remainder when requested", () => {
    const onRowsChange = vi.fn();
    render(
      <SubledgerDistributionTable
        initialRows={unbalancedRows}
        availableAccounts={mockAccounts}
        onRowsChange={onRowsChange}
      />
    );

    const balanceBtn = screen.getByRole("button", { name: /Balance Remainder/i });
    fireEvent.click(balanceBtn);

    expect(onRowsChange).toHaveBeenCalledTimes(1);
    expect(onRowsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ credit: 50 }),
      ]),
      true, // isBalanced
      0 // variance
    );
  });

  it("adds and removes distribution lines", () => {
    render(
      <SubledgerDistributionTable
        initialRows={balancedRows}
        availableAccounts={mockAccounts}
      />
    );

    const addBtn = screen.getByRole("button", { name: /Add Distribution Line/i });
    fireEvent.click(addBtn);

    expect(screen.getByText("3 lines")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: /Delete line 3/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByText("2 lines")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SubledgerDistributionTable
        initialRows={balancedRows}
        availableAccounts={mockAccounts}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
