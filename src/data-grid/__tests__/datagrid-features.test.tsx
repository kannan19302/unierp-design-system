import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type Column } from "../table";
import { ColumnPicker } from "../column-picker";
import { toCsv } from "../csv";

interface Row {
  id: string;
  name: string;
  qty: number;
}

const columns: Column<Row>[] = [
  { key: "name", header: "Name" },
  { key: "qty", header: "Qty", align: "right" },
];

const data: Row[] = [
  { id: "1", name: "Widget", qty: 1200 },
  { id: "2", name: "Gadget", qty: 45 },
];

describe("DataTable selection", () => {
  it("renders checkboxes and toggles a single row", async () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        selectedKeys={[]}
        onSelectionChange={onSelectionChange}
      />,
    );
    const boxes = screen.getAllByRole("checkbox", { name: "Select row" });
    expect(boxes).toHaveLength(2);
    await userEvent.click(boxes[1]!);
    expect(onSelectionChange).toHaveBeenCalledWith(["2"]);
  });

  it("select-all selects every row and clears when all selected", async () => {
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        selectedKeys={[]}
        onSelectionChange={onSelectionChange}
      />,
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Select all rows" }),
    );
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"]);

    rerender(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        selectedKeys={["1", "2"]}
        onSelectionChange={onSelectionChange}
      />,
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Select all rows" }),
    );
    expect(onSelectionChange).toHaveBeenLastCalledWith([]);
  });

  it("shows the bulk-action bar only while rows are selected", () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        selectedKeys={[]}
        onSelectionChange={() => {}}
        bulkActions={(keys) => <button>Delete {keys.length}</button>}
      />,
    );
    expect(screen.queryByRole("toolbar")).not.toBeInTheDocument();
    rerender(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        selectedKeys={["1"]}
        onSelectionChange={() => {}}
        bulkActions={(keys) => <button>Delete {keys.length}</button>}
      />,
    );
    expect(
      screen.getByRole("toolbar", { name: "Bulk actions" }),
    ).toBeInTheDocument();
    expect(screen.getByText("1 selected")).toBeInTheDocument();
    expect(screen.getByText("Delete 1")).toBeInTheDocument();
  });
});

describe("DataTable virtualization", () => {
  it("windows rows when virtualized with a large dataset", () => {
    const big: Row[] = Array.from({ length: 1000 }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
      qty: i,
    }));
    render(
      <DataTable
        columns={columns}
        data={big}
        rowKey={(r) => r.id}
        virtualized
        rowHeight={40}
        maxHeight={400}
      />,
    );
    expect(screen.getByText("Row 0")).toBeInTheDocument();
    // Rows far below the window must not be mounted
    expect(screen.queryByText("Row 500")).not.toBeInTheDocument();
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeLessThan(60);
  });

  it("renders everything when the dataset fits without windowing", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        virtualized
      />,
    );
    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("Gadget")).toBeInTheDocument();
  });
});

describe("ColumnPicker", () => {
  it("toggles column visibility but never hides the last column", async () => {
    const onChange = vi.fn();
    render(
      <ColumnPicker
        options={[
          { key: "name", label: "Name" },
          { key: "qty", label: "Qty" },
        ]}
        visible={["name", "qty"]}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Columns" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "Qty" }));
    expect(onChange).toHaveBeenCalledWith(["name"]);

    onChange.mockClear();
    // With only one visible column, unchecking it is ignored
    render(
      <ColumnPicker
        options={[{ key: "name", label: "OnlyCol" }]}
        visible={["name"]}
        onChange={onChange}
      />,
    );
    const buttons = screen.getAllByRole("button", { name: "Columns" });
    await userEvent.click(buttons[buttons.length - 1]!);
    await userEvent.click(screen.getByRole("checkbox", { name: "OnlyCol" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("toCsv", () => {
  it("serializes headers, escapes quotes/commas, honors exportValue", () => {
    const cols: Column<Row>[] = [
      { key: "name", header: "Name" },
      { key: "qty", header: "Qty", exportValue: (r) => r.qty * 2 },
    ];
    const rows: Row[] = [
      { id: "1", name: 'A "quoted", name', qty: 10 },
      { id: "2", name: "Plain", qty: 5 },
    ];
    const csv = toCsv(cols, rows);
    expect(csv.split("\r\n")).toEqual([
      "Name,Qty",
      '"A ""quoted"", name",20',
      "Plain,10",
    ]);
  });

  it("renders empty strings for null/undefined", () => {
    const cols: Column<{ a?: string | null }>[] = [{ key: "a", header: "A" }];
    expect(toCsv(cols, [{ a: null }, {}])).toBe("A\r\n\r\n");
  });
});

describe("DataTable cumulative column pinning", () => {
  it("calculates cumulative sticky offsets for multiple pinned left columns", () => {
    const cols: Column<Row>[] = [
      { key: "id", header: "ID", pinned: "left", width: 80 },
      { key: "name", header: "Name", pinned: "left", width: 120 },
      { key: "qty", header: "Qty", width: 100 },
    ];
    render(
      <DataTable
        columns={cols}
        data={data}
        rowKey={(r) => r.id}
        selectedKeys={[]}
        onSelectionChange={() => {}}
      />,
    );

    const idHeader = screen.getByText("ID").closest("th");
    const nameHeader = screen.getByText("Name").closest("th");
    expect(idHeader).toHaveStyle({ position: "sticky", left: "40px" });
    expect(nameHeader).toHaveStyle({ position: "sticky", left: "120px" });
  });
});

describe("DataTable grouped virtualization", () => {
  it("renders grouped sections and rows with virtualization enabled", () => {
    const groupedData = [
      { id: "1", name: "Alpha", category: "Hardware", qty: 10 },
      { id: "2", name: "Beta", category: "Hardware", qty: 20 },
      { id: "3", name: "Gamma", category: "Software", qty: 30 },
    ];
    const cols: Column<any>[] = [
      { key: "name", header: "Name" },
      { key: "qty", header: "Qty" },
    ];

    render(
      <DataTable
        columns={cols}
        data={groupedData}
        groupBy="category"
        virtualized
        maxHeight={300}
        rowHeight={36}
        rowKey={(r) => r.id}
      />,
    );

    expect(screen.getByText("Hardware")).toBeInTheDocument();
    expect(screen.getByText("Software")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });
});

