import React, { createRef } from "react";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { DataTable, type Column } from "../table";

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
});
