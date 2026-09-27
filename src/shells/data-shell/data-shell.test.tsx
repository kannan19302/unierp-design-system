import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { DataWorkspace, DataShell } from "./data-shell";

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

  it("uses native row action buttons while retaining table row semantics", async () => {
    const handleRowClick = vi.fn();
    render(<DataWorkspace columns={COLUMNS} data={DATA} onRowClick={handleRowClick} />);

    expect(screen.getByRole("table", { name: "Records" })).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3);
    const rows = screen.getAllByRole("button", { name: /Open record/ });
    rows[0]!.focus();
    await userEvent.keyboard("{Enter}");
    expect(handleRowClick).toHaveBeenCalledWith(DATA[0]);

    rows[1]!.focus();
    await userEvent.keyboard(" ");
    expect(handleRowClick).toHaveBeenCalledWith(DATA[1]);
  });

  it("extracts custom row IDs with getRowId prop", () => {
    const getRowId = vi.fn((row: typeof DATA[0]) => `custom-${row.id}`);
    const { container } = render(
      <DataWorkspace columns={COLUMNS} data={DATA} getRowId={getRowId} />,
    );

    expect(getRowId).toHaveBeenCalled();
    const tr = container.querySelector("tbody tr");
    expect(tr).toBeInTheDocument();
    expect(tr).not.toHaveAttribute("role", "button");
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

  it("handles column sorting when a sortable column header is clicked", () => {
    const SORTABLE_COLUMNS = [
      { key: "id", header: "ID" },
      { key: "name", header: "Name", sortable: true },
    ];
    const onSortChange = vi.fn();
    render(
      <DataWorkspace
        columns={SORTABLE_COLUMNS}
        data={DATA}
        onSortChange={onSortChange}
      />
    );

    const nameHeader = screen.getByRole("button", { name: "Name" });
    fireEvent.click(nameHeader);
    expect(onSortChange).toHaveBeenCalledWith("name", "asc");

    fireEvent.click(nameHeader);
    expect(onSortChange).toHaveBeenCalledWith("name", "desc");
  });

  it("supports selectable rows with master and row checkboxes", () => {
    const onSelectionChange = vi.fn();
    render(
      <DataWorkspace
        columns={COLUMNS}
        data={DATA}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    const masterCheckbox = screen.getByRole("checkbox", { name: "Select all visible records" });
    expect(masterCheckbox).toBeInTheDocument();
    expect(masterCheckbox).not.toBeChecked();

    fireEvent.click(masterCheckbox);
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"], DATA);
  });

  it("clears search query when clear button is clicked", () => {
    render(<DataWorkspace columns={COLUMNS} data={DATA} />);
    const searchInput = screen.getByRole("searchbox", { name: "Search records" });
    fireEvent.change(searchInput, { target: { value: "Alpha" } });

    const clearBtn = screen.getByRole("button", { name: "Clear search" });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);

    expect(searchInput).toHaveValue("");
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("renders density attribute data-density correctly", () => {
    const { container } = render(<DataWorkspace columns={COLUMNS} data={DATA} density="compact" />);
    const root = container.querySelector('[data-floorplan="data-workspace"]');
    expect(root).toHaveAttribute("data-density", "compact");
  });

  it("maps the legacy default density to standard and supports ultra-compact", () => {
    const { container, rerender } = render(<DataWorkspace columns={COLUMNS} data={DATA} density="default" />);
    const root = container.querySelector('[data-floorplan="data-workspace"]');
    expect(root).toHaveAttribute("data-density", "standard");
    rerender(<DataWorkspace columns={COLUMNS} data={DATA} density="ultra-compact" />);
    expect(root).toHaveAttribute("data-density", "ultra-compact");
  });

  it("renders a string-address context action as a real button", () => {
    const onClick = vi.fn();
    render(<DataWorkspace columns={COLUMNS} data={DATA} segments={["Finance", "Invoices"]} action={{ label: "Create", onClick }} />);
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders active filter chips and allows clearing them", () => {
    const onFilterChange = vi.fn();
    render(
      <DataWorkspace
        columns={COLUMNS}
        data={DATA}
        filters={[{ key: "status", label: "Status", options: [{ label: "Active", value: "Active" }] }]}
        activeFilters={{ status: "Active" }}
        onFilterChange={onFilterChange}
      />
    );

    expect(screen.getByText("Status:")).toBeInTheDocument();
    const dismissBtn = screen.getByRole("button", { name: "Remove filter Status" });
    fireEvent.click(dismissBtn);
    expect(onFilterChange).toHaveBeenCalledWith({ status: "" });
  });

  it("renders via DataShell alias", () => {
    render(<DataShell columns={COLUMNS} data={DATA} title="Alias DataShell" />);
    expect(screen.getByRole("heading", { name: "Alias DataShell" })).toBeInTheDocument();
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <DataWorkspace
        columns={COLUMNS}
        data={DATA}
        title="Test Title"
        segments={["Admin", "Users"]}
        pagination={{
          page: 1,
          pageSize: 10,
          total: 20,
          onPageChange: vi.fn(),
        }}
      />
    );
    expect(container.querySelector('[data-slot="data-shell"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-shell-context-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-shell-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-shell-toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-shell-table-wrapper"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-shell-table"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-shell-pagination"]')).toBeInTheDocument();
  });
});
