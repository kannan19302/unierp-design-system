import type { Meta, StoryObj } from "@storybook/react";
import { CsvExportPanel, CsvExportButton } from "./csv-export";

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

/**
 * CSV serialization and export engine for tabular data, supporting RFC-4180 escaping,
 * custom export value mappers, and Excel-compatible UTF-8 BOM encoding.
 */
const meta: Meta<typeof CsvExportPanel> = {
  title: "Forms/CsvExport",
  component: CsvExportPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "CSV serialization utility and UI components providing RFC-4180 escaping, BOM encoding, density scaling, and client-side triggerable downloads.",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling mode",
    },
    title: {
      control: "text",
      description: "Header title of the export panel",
    },
    description: {
      control: "text",
      description: "Explanatory description of the export operation",
    },
    filename: {
      control: "text",
      description: "Target download filename",
    },
    showPreview: {
      control: "boolean",
      description: "Whether to render live raw CSV preview",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CsvExportPanel>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem" }}>
      <CsvExportPanel
        columns={sampleColumns}
        rows={sampleRows}
        filename="inventory-export.csv"
        title="CSV Serialization Engine"
        description="Generates RFC-4180 compliant CSV with Excel BOM header and quote escaping."
      />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", inlineSize: "38rem" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density}>
          <h5 style={{ marginBlockEnd: "var(--space-2)", textTransform: "capitalize" }}>
            Density: {density}
          </h5>
          <CsvExportPanel
            density={density}
            columns={sampleColumns}
            rows={sampleRows}
            title={`${density} CSV Panel`}
            description={`Rendered in ${density} density scaling`}
          />
        </div>
      ))}
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", inlineSize: "38rem" }}>
      <h3>Standalone Button & Panel Anatomy</h3>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
        <span>Quick Trigger:</span>
        <CsvExportButton columns={sampleColumns} rows={sampleRows} filename="quick.csv">
          Direct Download
        </CsvExportButton>
      </div>
      <CsvExportPanel
        columns={sampleColumns}
        rows={sampleRows}
        title="Embedded Export Container"
        description="Includes header, trigger action, and live monospace preview block."
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", inlineSize: "38rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Full Dataset with Preview</h4>
        <CsvExportPanel
          columns={sampleColumns}
          rows={sampleRows}
          filename="full-export.csv"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Empty Dataset</h4>
        <CsvExportPanel
          columns={sampleColumns}
          rows={[]}
          title="Empty Table Export"
          description="Exports header row only when dataset is empty"
        />
      </div>
    </div>
  ),
};
