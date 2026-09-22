import type { Meta, StoryObj } from "@storybook/react";
import { toCsv } from "./csv";
import styles from "./csv.module.css";

const CsvDemo = () => {
  const columns = [
    { key: "sku", header: "SKU" },
    { key: "item", header: "Item Name" },
    { key: "qty", header: "Stock Qty" },
    { key: "price", header: "Unit Price" },
  ];
  const rows = [
    { sku: "SKU-001", item: "Titanium Bolt", qty: 1200, price: "$4.50" },
    { sku: "SKU-002", item: 'Carbon Seal "O-Ring"', qty: 850, price: "$2.10" },
    { sku: "SKU-003", item: "Aluminum Bracket", qty: 420, price: "$18.00" },
  ];

  const rawCsv = toCsv(columns, rows);

  return (
    <div className={styles.csvContainer}>
      <h4 style={{ margin: 0 }}>CSV Serialization Engine</h4>
      <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Generates UTF-8 encoded with RFC-4180 escaping and Excel BOM header.
      </p>
      <pre style={{ margin: 0, padding: "var(--space-3)", background: "var(--color-bg-sunken, #f8fafc)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)" }}>
        {rawCsv}
      </pre>
    </div>
  );
};

const meta: Meta = {
  title: "DataGrid/CsvExport",
  component: CsvDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <CsvDemo />,
};
