import React, { createRef } from "react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ThemeScope } from "../../foundation/theme/theme-scope";
import {
  DataTable,
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  type Column,
} from "./table";

interface Row {
  id: string;
  name: string;
  qty: number;
}

const columns: Column<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  {
    key: "qty",
    header: "Qty",
    align: "right",
    render: (r) => r.qty.toLocaleString(),
  },
];

const data: Row[] = [
  { id: "1", name: "Widget", qty: 1200 },
  { id: "2", name: "Gadget", qty: 45 },
];

describe("DataTable", () => {
  it("moves actual cell focus with arrows and lets Tab leave the last cell", async () => {
    render(<><DataTable columns={columns} data={data} /><button>After table</button></>);
    const widget = screen.getByRole("cell", { name: "Widget" });
    act(() => widget.focus());
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("cell", { name: "Gadget" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("cell", { name: "45" })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole("button", { name: "After table" })).toHaveFocus();
  });

  it("preserves source-index selection keys after grouping and collapse", async () => {
    const grouped = [
      { id: "a", name: "First", qty: 1, group: "Open" },
      { id: "b", name: "Second", qty: 2, group: "Closed" },
      { id: "c", name: "Third", qty: 3, group: "Open" },
    ];
    const selection = vi.fn();
    render(<DataTable columns={columns} data={grouped} groupBy="group" selectedKeys={["1"]} onSelectionChange={selection} />);
    const second = screen.getByRole("row", { name: /Second/ });
    expect(within(second).getByRole("checkbox")).toBeChecked();
    await userEvent.click(screen.getByRole("button", { name: "Open 2" }));
    expect(screen.queryByText("First")).not.toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Second/ })).getByRole("checkbox")).toBeChecked();
    await userEvent.click(within(screen.getByRole("row", { name: /Second/ })).getByRole("checkbox"));
    expect(selection).toHaveBeenLastCalledWith([]);
  });

  it("edits the focused displayed record across group boundaries and restores focus", async () => {
    const edit = vi.fn();
    const grouped = [
      { id: "a", name: "First", qty: 1, group: "Open" },
      { id: "b", name: "Second", qty: 2, group: "Closed" },
      { id: "c", name: "Third", qty: 3, group: "Open" },
    ];
    render(<DataTable columns={[{ key: "name", header: "Name", editable: true }]} data={grouped} groupBy="group" onCellEdit={edit} />);
    act(() => screen.getByRole("cell", { name: "Third" }).focus());
    await userEvent.keyboard("{ArrowDown}{F2}");
    const editor = screen.getByRole("textbox", { name: "Edit Name" });
    expect(editor).toHaveValue("Second");
    await userEvent.clear(editor);
    await userEvent.type(editor, "Updated{Enter}");
    expect(edit).toHaveBeenCalledTimes(1);
    expect(edit).toHaveBeenCalledWith("1", "name", "Updated");
    expect(screen.getByRole("cell", { name: "Updated" })).toHaveFocus();
  });

  it("cancels editing on Escape without submitting through blur", async () => {
    const edit = vi.fn();
    render(<DataTable columns={[{ key: "name", header: "Name", editable: true }]} data={data} onCellEdit={edit} />);
    act(() => screen.getByRole("cell", { name: "Widget" }).focus());
    await userEvent.keyboard("{F2}");
    await userEvent.type(screen.getByRole("textbox"), " changed{Escape}");
    expect(edit).not.toHaveBeenCalled();
    expect(screen.getByRole("cell", { name: "Widget" })).toHaveFocus();
  });

  it("keeps confirmed edits source-authoritative and reports rejected persistence", async () => {
    const persist = vi.fn().mockResolvedValue(false);
    render(
      <DataTable
        columns={[{ key: "name", header: "Name", editable: true }]}
        data={data}
        onCellEditCommit={persist}
      />,
    );
    act(() => screen.getByRole("cell", { name: "Widget" }).focus());
    await userEvent.keyboard("{F2}");
    const editor = screen.getByRole("textbox", { name: "Edit Name" });
    await userEvent.clear(editor);
    await userEvent.type(editor, "Rejected update{Enter}");

    expect(persist).toHaveBeenCalledWith("0", "name", "Rejected update");
    expect(screen.getByRole("cell", { name: "Widget" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Rejected update" })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Changes were not saved");
  });

  it("reports confirmed persistence without applying a local optimistic value", async () => {
    const persist = vi.fn().mockResolvedValue(true);
    render(
      <DataTable
        columns={[{ key: "name", header: "Name", editable: true }]}
        data={data}
        onCellEditCommit={persist}
      />,
    );
    act(() => screen.getByRole("cell", { name: "Widget" }).focus());
    await userEvent.keyboard("{F2}");
    const editor = screen.getByRole("textbox", { name: "Edit Name" });
    await userEvent.clear(editor);
    await userEvent.type(editor, "Confirmed update{Enter}");

    expect(await screen.findByRole("status")).toHaveTextContent("Changes saved");
    expect(screen.getByRole("cell", { name: "Widget" })).toBeInTheDocument();
  });
  it("renders headers and rows", () => {
    render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
  });

  it("shows the empty state when there is no data", () => {
    render(<DataTable columns={columns} data={[]} emptyTitle="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("reports sort changes on sortable headers", async () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        sortBy="name"
        sortOrder="asc"
        onSortChange={onSortChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(onSortChange).toHaveBeenCalledWith("name", "desc");
  });

  it("supports an accessible caption and composed workbench controls", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        caption="Open inventory adjustments"
        toolbar={<button type="button">Filter records</button>}
        footer={<span>2 results</span>}
      />,
    );

    expect(screen.getByRole("table", { name: "Open inventory adjustments" })).toBeInTheDocument();
    expect(screen.getByRole("toolbar", { name: "Table controls" })).toBeInTheDocument();
    expect(screen.getByText("2 results")).toBeInTheDocument();
  });

  it("renders an optional caller-owned mobile alternative beside the default table", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        aria-label="Inventory"
        mobileAlternative={<ul aria-label="Inventory mobile list"><li>Widget mobile row</li></ul>}
      />,
    );

    expect(container.querySelector('[data-has-mobile-alternative="true"]')).toBeInTheDocument();
    const alternative = container.querySelector('[data-slot="data-table-mobile-alternative"]');
    expect(alternative).toHaveTextContent("Widget mobile row");
    expect(screen.getByRole("table", { name: "Inventory" })).toBeInTheDocument();
    expect(alternative?.querySelector("ul")?.getAttribute("aria-label")).toBe("Inventory mobile list");
  });

  it("announces selection and gives row checkboxes contextual labels", async () => {
    function SelectionHarness() {
      const [selected, setSelected] = React.useState<string[]>([]);
      return (
        <DataTable
          columns={columns}
          data={data}
          rowKey={(row) => row.id}
          rowLabel={(row) => row.name}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          bulkActions={() => <button type="button">Archive</button>}
        />
      );
    }

    render(<SelectionHarness />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Select Widget" }));
    expect(screen.getByRole("status")).toHaveTextContent("1 selected");
    expect(screen.getByRole("toolbar", { name: "Bulk actions" })).toBeInTheDocument();
  });

  it("fires onRowClick with the row", async () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns} data={data} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText("Widget"));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
    const row = screen.getByRole("row", { name: /Widget/ });
    row.focus();
    await userEvent.keyboard("{Enter}");
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("gives each row selection a distinct fallback name and labels the scroll region", () => {
    render(<DataTable columns={columns} data={data} selectedKeys={[]} onSelectionChange={vi.fn()} aria-label="Inventory" />);
    expect(screen.getByRole("checkbox", { name: "Select row 0" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Select row 1" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Inventory scroll area" })).toBeInTheDocument();
  });

  it("sorts with Enter on a focused column button", async () => {
    const onSortChange = vi.fn();
    render(<DataTable columns={columns} data={data} onSortChange={onSortChange} />);
    screen.getByRole("button", { name: "Name" }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onSortChange).toHaveBeenCalledWith("name", "asc");
  });

  it("forwards ref to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DataTable ref={ref} columns={columns} data={data} rowKey={(r) => r.id} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DataTable columns={columns} data={data} rowKey={(r) => r.id} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports 4-tier density scaling on DataTable", () => {
    const { container, rerender } = render(<DataTable columns={columns} data={data} density="ultra-compact" />);
    const root = container.querySelector('[data-slot="data-table"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");

    rerender(<DataTable columns={columns} data={data} density="compact" />);
    expect(root).toHaveAttribute("data-density", "compact");

    rerender(<DataTable columns={columns} data={data} density="comfortable" />);
    expect(root).toHaveAttribute("data-density", "comfortable");

    rerender(<DataTable columns={columns} data={data} density="standard" />);
    expect(root).toHaveAttribute("data-density", "standard");
  });

  it("inherits density from its nearest scope when no density override is provided", () => {
    const { container } = render(
      <ThemeScope density="compact">
        <DataTable columns={columns} data={data} virtualized maxHeight={20} />
      </ThemeScope>,
    );
    const root = container.querySelector('[data-slot="data-table"]');
    const row = container.querySelector('[data-slot="data-table-row"]');
    expect(root).not.toHaveAttribute("data-density");
    expect(row).toHaveStyle({ "--data-row-height": "28px" });
  });

  it("keeps an explicit density override authoritative inside a different scope", () => {
    const { container } = render(
      <ThemeScope density="comfortable">
        <DataTable columns={columns} data={data} density="ultra-compact" virtualized maxHeight={20} />
      </ThemeScope>,
    );
    const root = container.querySelector('[data-slot="data-table"]');
    const row = container.querySelector('[data-slot="data-table-row"]');
    expect(root).toHaveAttribute("data-density", "ultra-compact");
    expect(row).toHaveStyle({ "--data-row-height": "24px" });
  });

  it("renders data-slot annotations on DataTable sub-elements", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={data}
        toolbar={<div>Filter</div>}
        footer={<div>Page 1 of 1</div>}
        caption="Inventory Items"
      />
    );
    expect(container.querySelector('[data-slot="data-table"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-toolbar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-container"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-table"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-caption"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-header-row"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-header-cell"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-body"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-row"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-cell"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="data-table-footer-controls"]')).toBeInTheDocument();
  });
});

describe("Composable Table Primitives", () => {
  it("renders standard composable table structure with data-slots and density", () => {
    const { container } = render(
      <Table density="compact">
        <TableCaption>Invoice Line Items</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>SKU-001</TableCell>
            <TableCell>Server License</TableCell>
            <TableCell>$5,000.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>$5,000.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    expect(screen.getByText("Invoice Line Items")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "SKU" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "SKU-001" })).toBeInTheDocument();
    expect(screen.getAllByRole("cell", { name: "$5,000.00" })).toHaveLength(2);

    expect(container.querySelector('[data-slot="table-container"]')).toHaveAttribute("data-density", "compact");
    expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-caption"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-row"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-head"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-body"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-cell"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="table-footer"]')).toBeInTheDocument();
  });
});
