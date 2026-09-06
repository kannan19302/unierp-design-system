import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SpreadsheetGrid } from "./spreadsheet-grid";

const mockColumns = ["Col A", "Col B", "Col C"];
const mockData = [
  ["100", "200", "300"],
  ["400", "500", "600"],
];

describe("SpreadsheetGrid Component", () => {
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

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SpreadsheetGrid columns={mockColumns} initialData={mockData} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
