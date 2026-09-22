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

  it("activates row on keyboard Enter and Space keys", () => {
    const handleRowClick = vi.fn();
    render(<DataWorkspace columns={COLUMNS} data={DATA} onRowClick={handleRowClick} />);

    const rows = screen.getAllByRole("button");
    fireEvent.keyDown(rows[0], { key: "Enter" });
    expect(handleRowClick).toHaveBeenCalledWith(DATA[0]);

    fireEvent.keyDown(rows[1], { key: " " });
    expect(handleRowClick).toHaveBeenCalledWith(DATA[1]);
  });

  it("extracts custom row IDs with getRowId prop", () => {
    const getRowId = vi.fn((row: typeof DATA[0]) => `custom-${row.id}`);
    const { container } = render(
      <DataWorkspace columns={COLUMNS} data={DATA} getRowId={getRowId} />,
    );

    expect(getRowId).toHaveBeenCalled();
    const tr = container.querySelector('tr[role="button"]') ?? container.querySelector("tbody tr");
    expect(tr).toBeInTheDocument();
  });

  it("preserves data rows in server mode when search input changes without client filtering", () => {
    const onSearchChange = vi.fn();
    render(
      <DataWorkspace
        columns={COLUMNS}
        data={DATA}
        mode="server"
        onSearchChange={onSearchChange}
      />,
    );

    const searchInput = screen.getByRole("searchbox", { name: "Search records" });
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });

    expect(onSearchChange).toHaveBeenCalledWith("NonExistent");
    // In server mode, client-side data is not truncated locally
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });
});
