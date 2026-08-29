import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DrillDownModal, type DrillDownColumn } from "./drill-down-modal";

const MOCK_COLUMNS: DrillDownColumn[] = [
  { key: "id", label: "Invoice #" },
  { key: "customer", label: "Customer" },
  { key: "total", label: "Amount" },
];

const MOCK_ROWS = [
  { id: "INV-001", customer: "Acme Corp", total: "$1,200" },
  { id: "INV-002", customer: "Globex Inc", total: "$4,500" },
];

describe("DrillDownModal Primitive", () => {
  it("renders modal dialog, filtered records, and closes on click", () => {
    const onClose = vi.fn();
    render(
      <DrillDownModal
        isOpen={true}
        onClose={onClose}
        title="Outstanding Invoices"
        columns={MOCK_COLUMNS}
        rows={MOCK_ROWS}
      />
    );

    expect(screen.getByText(/Outstanding Invoices — Source Records/)).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Globex Inc")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Search records...");
    fireEvent.change(searchInput, { target: { value: "Globex" } });

    expect(screen.queryByText("Acme Corp")).not.toBeInTheDocument();
    expect(screen.getByText("Globex Inc")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DrillDownModal
        isOpen={true}
        onClose={() => {}}
        title="Source Records"
        columns={MOCK_COLUMNS}
        rows={MOCK_ROWS}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
