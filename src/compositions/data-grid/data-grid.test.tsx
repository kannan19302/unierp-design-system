import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SpreadsheetGrid, DataGrid, dataGridVariants } from "./data-grid";

const mockColumns = ["Col A", "Col B", "Col C"];
const mockData = [
  ["100", "200", "300"],
  ["400", "500", "600"],
];

describe("DataGrid / SpreadsheetGrid Component", () => {
  it("renders headers, rows, and formula coordinate bar", () => {
    render(<SpreadsheetGrid columns={mockColumns} initialData={mockData} />);

    expect(screen.getByText("Col A")).toBeInTheDocument();
    expect(screen.getByText("Col B")).toBeInTheDocument();
    expect(screen.getByText("Col C")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByLabelText("Selected Cell: A1")).toBeInTheDocument();
  });

  it("updates selected cell and coordinate pill on cell click", () => {
    render(<SpreadsheetGrid columns={mockColumns} initialData={mockData} />);

    const cellB2 = screen.getByText("500");
    fireEvent.click(cellB2);
    expect(screen.getByLabelText("Selected Cell: B2")).toBeInTheDocument();
  });

  it("handles keyboard arrow navigation", () => {
    render(<SpreadsheetGrid columns={mockColumns} initialData={mockData} />);

    const table = screen.getByRole("grid");
    fireEvent.keyDown(table, { key: "ArrowRight" });
    expect(screen.getByLabelText("Selected Cell: B1")).toBeInTheDocument();

    fireEvent.keyDown(table, { key: "ArrowDown" });
    expect(screen.getByLabelText("Selected Cell: B2")).toBeInTheDocument();
  });

  it("edits cell value on double click and notifies onChange", () => {
    const onChange = vi.fn();
    render(<SpreadsheetGrid columns={mockColumns} initialData={mockData} onChange={onChange} />);

    const cellA1 = screen.getByText("100");
    fireEvent.doubleClick(cellA1);

    const input = screen.getByLabelText("Editing Cell A1");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "999" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onChange).toHaveBeenCalledWith([
      ["999", "200", "300"],
      ["400", "500", "600"],
    ]);
  });

  it("forwards ref to root container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<SpreadsheetGrid ref={ref} columns={mockColumns} initialData={mockData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies data-slot annotations throughout anatomy", () => {
    const { container } = render(<SpreadsheetGrid columns={mockColumns} initialData={mockData} />);
    expect(container.querySelector('[data-slot="data-grid"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-formula-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-coord"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-fx"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-formula-input"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-table-container"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-table"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-head"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-body"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-grid-cell"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <SpreadsheetGrid columns={mockColumns} initialData={mockData} density={density} />
      );
      const root = container.querySelector('[data-slot="data-grid"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("aliases DataGrid to SpreadsheetGrid", () => {
    expect(DataGrid).toBe(SpreadsheetGrid);
    const classes = dataGridVariants({ density: "ultra-compact" });
    expect(classes).toContain("densityUltraCompact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SpreadsheetGrid columns={mockColumns} initialData={mockData} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
