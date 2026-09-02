import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { DataWorkspace } from "./data-workspace";

const COLUMNS = [
  { key: "id", header: "ID" },
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
];

const DATA = [
  { id: "1", name: "Alpha", status: "Active" },
  { id: "2", name: "Beta", status: "Inactive" },
];

describe("DataWorkspace", () => {
  it("renders table headers and data rows correctly", () => {
    render(<DataWorkspace columns={COLUMNS} data={DATA} title="Test Workspace" />);

    expect(screen.getByRole("heading", { name: "Test Workspace" })).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("filters records based on search input", () => {
    render(<DataWorkspace columns={COLUMNS} data={DATA} />);

    const searchInput = screen.getByRole("searchbox", { name: "Search records" });
    fireEvent.change(searchInput, { target: { value: "Alpha" } });

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Beta")).not.toBeInTheDocument();
  });

  it("renders empty state when no data matches", () => {
    render(
      <DataWorkspace
        columns={COLUMNS}
        data={[]}
        emptyTitle="Custom Empty"
        emptyDescription="Custom Description"
      />,
    );

    expect(screen.getByText("Custom Empty")).toBeInTheDocument();
    expect(screen.getByText("Custom Description")).toBeInTheDocument();
  });

  it("calls onRowClick when row is clicked", () => {
    const handleRowClick = vi.fn();
    render(<DataWorkspace columns={COLUMNS} data={DATA} onRowClick={handleRowClick} />);

    fireEvent.click(screen.getByText("Alpha"));
    expect(handleRowClick).toHaveBeenCalledWith(DATA[0]);
  });

  it("renders Meridian context boundary when segments are supplied", () => {
    render(
      <DataWorkspace
        columns={COLUMNS}
        data={DATA}
        segments={[{ label: "Finance", href: "/finance" }, { label: "Invoices" }]}
      />,
    );

    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Invoices")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DataWorkspace
        columns={COLUMNS}
        data={DATA}
        title="Accessible Table"
        segments={[{ label: "Finance", href: "/finance" }, { label: "Invoices" }]}
        pagination={{
          page: 1,
          pageSize: 10,
          total: 2,
          onPageChange: () => {},
        }}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
