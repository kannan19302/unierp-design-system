import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { toCsv, CsvExportButton, CsvExport, CsvExportPanel } from "./csv-export";
import type { Column } from "../../compositions/table";

const MOCK_COLUMNS: Column<{ id: string; name: string; amount: number }>[] = [
  { key: "id", header: "ID" },
  { key: "name", header: "Customer" },
  { key: "amount", header: "Amount" },
];

const MOCK_ROWS = [
  { id: "1", name: 'Acme, "Corp"', amount: 1500 },
  { id: "2", name: "Globex", amount: 2400 },
];

describe("CSV Export Utilities", () => {
  beforeEach(() => {
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  });

  it("converts column headers and row data into compliant CSV string", () => {
    const csv = toCsv(MOCK_COLUMNS, MOCK_ROWS);
    expect(csv).toContain("ID,Customer,Amount");
    expect(csv).toContain('"Acme, ""Corp"""');
    expect(csv).toContain("2,Globex,2400");
  });

  it("renders CsvExportButton with data-slot and handles click", () => {
    global.URL.createObjectURL = vi.fn(() => "blob:mock");
    global.URL.revokeObjectURL = vi.fn();

    render(
      <CsvExportButton columns={MOCK_COLUMNS} rows={MOCK_ROWS}>
        Download Data
      </CsvExportButton>
    );

    const button = screen.getByRole("button", { name: "Download Data" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("data-slot", "csv-export");

    fireEvent.click(button);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it("supports 4-tier density on CsvExportButton and CsvExport alias", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { unmount } = render(
        <CsvExport density={density} columns={MOCK_COLUMNS} rows={MOCK_ROWS}>
          Export
        </CsvExport>
      );
      const btn = screen.getByRole("button", { name: "Export" });
      expect(btn).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("renders CsvExportPanel with data-slot attributes and preview", () => {
    const { container } = render(
      <CsvExportPanel
        columns={MOCK_COLUMNS}
        rows={MOCK_ROWS}
        title="Order Export"
        description="Download orders"
      />
    );

    expect(container.querySelector('[data-slot="csv-export-panel"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="csv-export-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="csv-export-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="csv-export-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="csv-export-preview"]')).toBeInTheDocument();
    expect(screen.getByText("Order Export")).toBeInTheDocument();
    expect(screen.getByText("Download orders")).toBeInTheDocument();
  });

  it("supports 4-tier density on CsvExportPanel", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <CsvExportPanel
          density={density}
          columns={MOCK_COLUMNS}
          rows={MOCK_ROWS}
        />
      );
      const panel = container.querySelector('[data-slot="csv-export-panel"]');
      expect(panel).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("has zero accessibility violations on CsvExportPanel", async () => {
    const { container } = render(
      <CsvExportPanel
        columns={MOCK_COLUMNS}
        rows={MOCK_ROWS}
        title="Audit Logs Export"
        description="Ready for CSV download"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
