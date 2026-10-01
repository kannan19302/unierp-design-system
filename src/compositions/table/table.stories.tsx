import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
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
import { ColumnPicker } from "../../forms/column-picker";
import { exportToCsv } from "../../forms/csv-export";
import { Search, Download, MoreHorizontal } from "lucide-react";
import { Button } from "../../primitives/button";
import { Input, Select } from "../../inputs/form-control";
import { Pagination } from "../../navigation/pagination";
import { DropdownMenu } from "../../overlays/dropdown-menu";
import styles from "./table.module.css";

const meta: Meta<typeof DataTable> = {
  title: "Compositions/Table",
  component: DataTable,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata DL 4-tier density scaling (24px, 28px, 32px, 40px)",
    },
    loading: {
      control: "boolean",
      description: "Displays animated skeleton loading rows",
    },
    virtualized: {
      control: "boolean",
      description: "Window rows inside a fixed-height scroll container for large datasets",
    },
    maxHeight: {
      control: "number",
      description: "Maximum height of virtualized scroll container in pixels",
    },
    rowHeight: {
      control: "number",
      description: "Explicit row height in pixels overriding density default",
    },
    keyboardNav: {
      control: "boolean",
      description: "Enable Excel-style arrow navigation and F2 cell editing",
    },
    mobileAlternative: {
      control: false,
      description: "Caller-owned presentation displayed in narrow containers instead of the scrollable table",
    },
  },
};

export default meta;

const columns: Column<{
  id: string;
  name: string;
  status: string;
  amount: number;
}>[] = [
  { key: "id", header: "ID", width: "96px" },
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
    const [selectedAction, setSelectedAction] = useState("");
    const workbenchColumns: Column<(typeof data)[number]>[] = [
      ...columns,
      {
        key: "actions",
        header: "Actions",
        width: "80px",
        align: "center",
        render: (row) => (
          <DropdownMenu
            density="standard"
            trigger={
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Actions for invoice ${row.id}`}
              >
                <MoreHorizontal size={14} aria-hidden="true" />
              </Button>
            }
            items={[
              {
                key: "view",
                label: "View invoice",
                onClick: () => setSelectedAction(`Viewing invoice ${row.id}`),
              },
              {
                key: "activity",
                label: "View activity",
                onClick: () => setSelectedAction(`Showing activity for ${row.id}`),
              },
            ]}
          />
        ),
      },
    ];
    const filtered = data.filter((row) =>
      (!status || row.status === status) && `${row.id} ${row.name} ${row.status}`.toLowerCase().includes(query.toLowerCase()),
    );
    const pageInvoices = filtered.slice((page - 1) * 8, page * 8);

    return (
      <>
        <DataTable
        aria-label="Accounts receivable invoices"
        columns={workbenchColumns}
        data={pageInvoices}
        rowKey={(row) => row.id}
        rowLabel={(row) => `invoice ${row.id}`}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        mobileAlternative={
          pageInvoices.length === 0 ? (
            <p role="status">No invoices match these filters.</p>
          ) : (
            <ul className={styles.mobileCardList} aria-label="Accounts receivable invoices, mobile view">
              {pageInvoices.map((row) => (
                <li key={`mobile-${row.id}`}>
                  <article className={styles.mobileCard} aria-labelledby={`mobile-invoice-${row.id}`}>
                    <header className={styles.mobileCardHeader}>
                      <h3 className={styles.mobileCardTitle} id={`mobile-invoice-${row.id}`}>{row.id}</h3>
                      <label className={styles.mobileCardSelect}>
                        <input
                          type="checkbox"
                          aria-label={`Select invoice ${row.id}`}
                          checked={selected.includes(row.id)}
                          onChange={(event) => {
                            const checked = event.currentTarget.checked;
                            setSelected((current) => checked
                              ? [...current, row.id]
                              : current.filter((selectedId) => selectedId !== row.id),
                            );
                          }}
                        />
                        Select
                      </label>
                    </header>
                    <dl className={styles.mobileCardFields}>
                      <div className={styles.mobileCardField}>
                        <dt className={styles.mobileCardLabel}>Customer</dt>
                        <dd className={styles.mobileCardValue}>{row.name}</dd>
                      </div>
                      <div className={styles.mobileCardField}>
                        <dt className={styles.mobileCardLabel}>Status</dt>
                        <dd className={styles.mobileCardValue}>{row.status}</dd>
                      </div>
                      <div className={styles.mobileCardField}>
                        <dt className={styles.mobileCardLabel}>Amount</dt>
                        <dd className={styles.mobileCardValue}>${row.amount.toLocaleString()}</dd>
                      </div>
                    </dl>
                    <DropdownMenu
                      density="standard"
                      trigger={
                        <Button
                          className={styles.mobileCardActionButton}
                          variant="secondary"
                          size="sm"
                          aria-label={`Actions for invoice ${row.id}`}
                        >
                          Actions
                        </Button>
                      }
                      items={[
                        { key: "view", label: "View invoice", onClick: () => setSelectedAction(`Viewing invoice ${row.id}`) },
                        { key: "activity", label: "View activity", onClick: () => setSelectedAction(`Showing activity for ${row.id}`) },
                      ]}
                    />
                  </article>
                </li>
              ))}
            </ul>
          )
        }
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
        {selectedAction && <p role="status">{selectedAction}</p>}
      </>
    );
  },
};

export const Default: StoryObj = {
  render: () => <DataTable columns={columns} data={data} />,
};

export const KeyboardRowAction: StoryObj = {
  render: function KeyboardRowActionStory() {
    const [opened, setOpened] = useState("No invoice opened");
    return (
      <div>
        <DataTable
          aria-label="Invoices"
          columns={columns}
          data={data.slice(0, 4)}
          rowKey={(row) => row.id}
          onRowClick={(row) => setOpened(`${row.id} opened`)}
        />
        <p role="status">{opened}</p>
      </div>
    );
  },
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

export const ConfirmedEditing: StoryObj = {
  render: function ConfirmedEditingStory() {
    const [rows, setRows] = useState([
      { id: "INV-A", name: "North invoice", status: "Open" },
      { id: "INV-B", name: "South invoice", status: "Closed" },
    ]);
    const [rejectNext, setRejectNext] = useState(true);
    const [notice, setNotice] = useState("");
    const saveEdit = async (key: string, column: string, value: string) => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      if (rejectNext) {
        setRejectNext(false);
        setNotice("Demo save rejected. The original value remains.");
        return false;
      }
      setRows((previous) => previous.map((row) => row.id === key ? { ...row, [column]: value } : row));
      setNotice("Demo save accepted.");
      return true;
    };
    return (
      <>
        <DataTable
          caption="Use F2 to edit an invoice. Confirmed edits update after save; rejected edits keep the original value."
          columns={[{ key: "id", header: "Invoice" }, { key: "name", header: "Name", editable: true }]}
          data={rows}
          rowKey={(row) => row.id}
          onCellEditCommit={saveEdit}
        />
        {notice && <p role="status">{notice}</p>}
        <Button variant="secondary" onClick={() => setRejectNext((previous) => !previous)}>
          {rejectNext ? "Next save will be rejected" : "Next save will be accepted"}
        </Button>
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

export const ComposableTable: StoryObj = {
  render: () => (
    <div style={{ maxInlineSize: "600px" }}>
      <Table>
        <TableCaption>A composable list of recent enterprise payment runs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Run ID</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead style={{ textAlign: "end" }}>Total Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>PR-2026-081</TableCell>
            <TableCell>ACH Direct</TableCell>
            <TableCell>Completed</TableCell>
            <TableCell style={{ textAlign: "end" }}>$452,100.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>PR-2026-082</TableCell>
            <TableCell>Wire Transfer</TableCell>
            <TableCell>Processing</TableCell>
            <TableCell style={{ textAlign: "end" }}>$1,250,000.00</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Grand Total</TableCell>
            <TableCell style={{ textAlign: "end" }}>$1,702,100.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
};

export const DensityGallery: StoryObj = {
  render: () => {
    const sampleData = data.slice(0, 3);
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;

    return (
      <div style={{ display: "grid", gap: "var(--space-6)" }}>
        {densities.map((d) => (
          <div key={d} style={{ display: "grid", gap: "var(--space-2)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Density: {d} ({d === "ultra-compact" ? "24px" : d === "compact" ? "28px" : d === "standard" ? "32px" : "40px"})
            </div>
            <DataTable
              density={d}
              columns={columns}
              data={sampleData}
              rowKey={(r) => r.id}
              aria-label={`Invoices ${d}`}
            />
          </div>
        ))}
      </div>
    );
  },
};
