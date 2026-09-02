import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { TransactionWorkspace } from "./transaction-workspace";

describe("TransactionWorkspace", () => {
  it("renders title, header fields, line items, and summary totals", () => {
    render(
      <TransactionWorkspace
        title="Journal Entry"
        documentNumber="JE-001"
        headerFields={<div>Posting Date: 2026-09-02</div>}
        summaryItems={[
          { label: "Total Debits", value: "$150.00" },
          { label: "Total Credits", value: "$150.00" },
        ]}
        footerActions={<button type="button">Post</button>}
      >
        <div>Line items content</div>
      </TransactionWorkspace>,
    );

    expect(screen.getByRole("heading", { name: "Journal Entry — JE-001" })).toBeInTheDocument();
    expect(screen.getByText("Posting Date: 2026-09-02")).toBeInTheDocument();
    expect(screen.getByText("Line items content")).toBeInTheDocument();
    expect(screen.getByText("Total Debits")).toBeInTheDocument();
    expect(screen.getAllByText("$150.00")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Post" })).toBeInTheDocument();
  });

  it("renders Meridian context boundary when segments are supplied", () => {
    render(
      <TransactionWorkspace
        title="Invoice"
        segments={[{ label: "Finance", href: "/finance" }, { label: "INV-100" }]}
        headerFields={<div>Header</div>}
      >
        <div>Lines</div>
      </TransactionWorkspace>,
    );

    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("INV-100")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <TransactionWorkspace
        title="Invoice Voucher"
        documentNumber="INV-100"
        segments={[{ label: "Finance", href: "/finance" }, { label: "INV-100" }]}
        headerFields={<div>Header Info</div>}
        summaryItems={[{ label: "Total", value: "$500.00" }]}
        footerActions={<button type="button">Submit</button>}
      >
        <div>Lines Table</div>
      </TransactionWorkspace>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
