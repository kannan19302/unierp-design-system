import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type Column } from "./table";
import { ColumnPicker } from "../column-picker";
import { exportToCsv } from "../csv";
import { Search, Download } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input, Select } from "../../inputs/form-control";
import { Pagination } from "../../navigation/pagination";

const meta: Meta<typeof DataTable> = {
  title: "Core/Data Grid/DataTable",
  component: DataTable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};

export default meta;

const columns: Column<{
  id: string;
  name: string;
  status: string;
  amount: number;
}>[] = [
  { key: "id", header: "ID", width: "80px" },
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
  {
    key: "amount",
    header: "Amount",
    align: "right",
    render: (row) => `$${row.amount.toLocaleString()}`,
  },
];

const data = Array.from({ length: 20 }, (_, i) => ({
  id: `INV-${String(i + 1).padStart(3, "0")}`,
  name: `Customer ${i + 1}`,
  status: ["PAID", "PENDING", "OVERDUE", "DRAFT"][i % 4]!,
  amount: 1250 + i * 437,
}));

export const EnterpriseWorkbench: StoryObj = {
  render: function EnterpriseWorkbenchStory() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const filtered = data.filter((row) =>
      (!status || row.status === status) && `${row.id} ${row.name} ${row.status}`.toLowerCase().includes(query.toLowerCase()),
    );

    return (
      <DataTable
        aria-label="Accounts receivable invoices"
        columns={columns}
        data={filtered.slice((page - 1) * 8, page * 8)}
        rowKey={(row) => row.id}
        rowLabel={(row) => `invoice ${row.id}`}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        toolbar={
          <>
            <Input
              aria-label="Search invoices"
              placeholder="Search invoices"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              prefixIcon={<Search size={16} aria-hidden="true" />}
            />
            <div style={{ display: "inline-flex", gap: "var(--space-2)" }}>
              <Select aria-label="Invoice status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
                <option value="">All statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
                <option value="DRAFT">Draft</option>
              </Select>
              <Button variant="secondary" size="sm" leftIcon={<Download size={16} />} onClick={() => exportToCsv(columns, filtered, "invoices")}>
                Export
              </Button>
            </div>
          </>
        }
        bulkActions={() => (
          <>
            <Button variant="secondary" size="sm" onClick={() => exportToCsv(columns, data.filter((row) => selected.includes(row.id)), "selected-invoices")}>Export selected</Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear</Button>
          </>
        )}
        footer={
          <>
            <span>{filtered.length} invoices</span>
            <Pagination
              page={page}
              pageCount={Math.max(1, Math.ceil(filtered.length / 8))}
              onChange={setPage}
            />
          </>
        }
      />
    );
  },
};

export const Default: StoryObj = {
  render: () => <DataTable columns={columns} data={data} />,
};

export const AnatomyAndComposition: StoryObj = {
  render: () => <DataTable columns={columns} data={data} />,
};

export const AllStatesGallery: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Populated Table</h4>
        <DataTable columns={columns} data={data.slice(0, 5)} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Empty Table</h4>
        <DataTable columns={columns} data={[]} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Loading State</h4>
        <DataTable columns={columns} data={[]} loading />
      </div>
    </div>
  ),
};

export const Empty: StoryObj = {
  render: () => <DataTable columns={columns} data={[]} />,
};

export const GroupedKeyboardEditing: StoryObj = {
  render: function GroupedKeyboardEditingStory() {
    const [rows, setRows] = useState([
      { id: "INV-A", name: "North invoice", status: "Open" },
      { id: "INV-B", name: "South invoice", status: "Closed" },
      { id: "INV-C", name: "West invoice", status: "Open" },
    ]);
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <>
        <DataTable
          caption="Use arrow keys to move cells, F2 to edit, Escape to cancel, and Tab to leave."
          columns={[{ key: "id", header: "Invoice" }, { key: "name", header: "Name", editable: true }]}
          data={rows}
          groupBy="status"
          rowKey={(row) => row.id}
          rowLabel={(row) => row.id}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          onCellEdit={(key, column, value) => setRows((previous) => previous.map((row) => row.id === key ? { ...row, [column]: value } : row))}
        />
        <Button variant="secondary">After table</Button>
      </>
    );
  },
};

export const LargeDataset: StoryObj = {
  render: () => {
    const largeData = Array.from({ length: 500 }, (_, i) => ({
      id: `ROW-${i + 1}`,
      name: `Item ${i + 1}`,
      status: ["ACTIVE", "INACTIVE"][i % 2]!,
      amount: 500 + i * 73,
    }));
    return <DataTable columns={columns} data={largeData} />;
  },
};

export const WithSelectionAndBulkActions: StoryObj = {
  render: function SelectionStory() {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        bulkActions={(keys) => (
          <>
            <button
              onClick={() =>
                exportToCsv(
                  columns,
                  data.filter((d) => keys.includes(d.id)),
                  "selection",
                )
              }
            >
              Export selected
            </button>
            <button onClick={() => setSelected([])}>Clear</button>
          </>
        )}
      />
    );
  },
};

export const Virtualized: StoryObj = {
  render: () => {
    const largeData = Array.from({ length: 10_000 }, (_, i) => ({
      id: `ROW-${i + 1}`,
      name: `Item ${i + 1}`,
      status: ["ACTIVE", "INACTIVE"][i % 2]!,
      amount: 500 + i * 73,
    }));
    return (
      <DataTable
        columns={columns}
        data={largeData}
        rowKey={(r) => r.id}
        virtualized
        maxHeight={420}
      />
    );
  },
};

export const WithColumnPicker: StoryObj = {
  render: function ColumnPickerStory() {
    const [visible, setVisible] = useState(columns.map((c) => c.key));
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "flex-end",
        }}
      >
        <ColumnPicker
          options={columns.map((c) => ({
            key: c.key,
            label: String(c.header),
          }))}
          visible={visible}
          onChange={setVisible}
        />
        <div style={{ alignSelf: "stretch" }}>
          <DataTable
            columns={columns.filter((c) => visible.includes(c.key))}
            data={data}
            rowKey={(r) => r.id}
          />
        </div>
      </div>
    );
  },
};
