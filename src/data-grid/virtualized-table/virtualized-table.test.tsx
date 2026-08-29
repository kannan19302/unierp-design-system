import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { VirtualizedTable, type VirtualizedColumn } from "../virtualized-table";

interface TestItem {
  id: string;
  name: string;
  amount: number;
}

const mockColumns: VirtualizedColumn<TestItem>[] = [
  { key: "id", header: "ID", width: 100, sortable: true },
  { key: "name", header: "Name", width: 200, sortable: true },
  { key: "amount", header: "Amount", width: 120, sortable: true },
];

const mockData: TestItem[] = [
  { id: "1", name: "Alpha", amount: 100 },
  { id: "2", name: "Beta", amount: 250 },
  { id: "3", name: "Gamma", amount: 50 },
];

describe("VirtualizedTable Primitive", () => {
  it("renders headers and initial records", () => {
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        rowKey={(r) => r.id}
        viewportHeight={300}
        rowHeight={30}
      />
    );

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("filters records based on search query", () => {
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        rowKey={(r) => r.id}
        viewportHeight={300}
        rowHeight={30}
      />
    );

    const searchInput = screen.getByLabelText("Filter rows");
    fireEvent.change(searchInput, { target: { value: "Beta" } });

    expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("handles selection changes", () => {
    const onSelectionChange = vi.fn();
    render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        rowKey={(r) => r.id}
        selectedKeys={[]}
        onSelectionChange={onSelectionChange}
        viewportHeight={300}
        rowHeight={30}
      />
    );

    const selectAllCheckbox = screen.getByLabelText("Select all rows");
    fireEvent.click(selectAllCheckbox);
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2", "3"]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <VirtualizedTable
        data={mockData}
        columns={mockColumns}
        rowKey={(r) => r.id}
        viewportHeight={300}
        rowHeight={30}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
