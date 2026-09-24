import type { Meta, StoryObj } from "@storybook/react";
import { toCsv, exportToCsv } from "./csv";
import styles from "./csv.module.css";
import { Button } from "../../primitives/button";

const sampleColumns = [
  { key: "sku", header: "SKU" },
  { key: "item", header: "Item Name" },
  { key: "qty", header: "Stock Qty" },
  { key: "price", header: "Unit Price" },
];

const sampleRows = [
  { sku: "SKU-001", item: "Titanium Bolt", qty: 1200, price: "$4.50" },
  { sku: "SKU-002", item: 'Carbon Seal "O-Ring"', qty: 850, price: "$2.10" },
  { sku: "SKU-003", item: "Aluminum Bracket, 90-degree", qty: 420, price: "$18.00" },
];

const CsvDemo = ({ filename = "inventory-export.csv" }: { filename?: string }) => {
  const rawCsv = toCsv(sampleColumns, sampleRows);

  return (
    <div className={styles.csvContainer} style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h4 style={{ margin: 0 }}>CSV Serialization Engine</h4>
          <p style={{ margin: "var(--space-1) 0 0", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
            Generates RFC-4180 compliant CSV with Excel BOM header and quote escaping.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportToCsv(sampleColumns, sampleRows, filename)}
        >
          Export CSV
        </Button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "var(--space-3)",
          background: "var(--color-surface-sunken)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--radius-sm)",
          fontSize: "var(--text-xs)",
          fontFamily: "var(--font-mono)",
          overflowX: "auto",
        }}
      >
        {rawCsv}
      </pre>
    </div>
  );
};

/**
 * CSV serialization and export engine for tabular data, supporting RFC-4180 escaping,
 * custom export value mappers, and Excel-compatible UTF-8 BOM encoding.
 */
const meta: Meta = {
  title: "Core/DataGrid/Csv",
  component: CsvDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "CSV serialization utility component providing RFC-4180 escaping, BOM encoding, and client-side triggerable downloads.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <CsvDemo />,
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 640 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Standard Dataset
        </h4>
        <CsvDemo filename="standard-export.csv" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Empty Table Export Preview
        </h4>
        <pre
          style={{
            margin: 0,
            padding: "var(--space-3)",
            background: "var(--color-surface-sunken)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--text-xs)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {toCsv(sampleColumns, [])}
        </pre>
      </div>
    </div>
  ),
};
