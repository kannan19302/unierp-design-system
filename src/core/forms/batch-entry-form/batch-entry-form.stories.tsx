import type { Meta, StoryObj } from "@storybook/react";
import { BatchEntryForm } from "./batch-entry-form";

const meta: Meta<typeof BatchEntryForm> = {
  title: "Core/Forms/BatchEntryForm",
  component: BatchEntryForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "label", enabled: true }],
      },
    },
  },
  argTypes: {
    columns: {
      description: "Array of header column names",
    },
    initialRows: {
      control: "number",
      description: "Default count of empty rows",
    },
    title: {
      control: "text",
      description: "Heading title for batch table",
    },
    onSubmit: {
      action: "batchSubmitted",
      description: "Callback receiving matrix data array",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BatchEntryForm>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "50rem", padding: "var(--space-4)" }}>
      <BatchEntryForm
        columns={["Date", "Description", "Debit", "Credit", "Account"]}
        title="Journal Voucher Batch Staging"
        subtitle="Enter balanced general ledger transactions prior to posting."
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "50rem", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        BatchEntryForm pairs spreadsheet-density cells with row instantiation, keyboard cell tab indexing,
        and atomic batch verification.
      </p>
      <BatchEntryForm
        columns={["SKU", "Bin Location", "Physical Count", "System Count", "Variance"]}
        initialData={[
          ["SKU-0012", "A-12-01", "140", "140", "0"],
          ["SKU-0089", "B-04-22", "55", "60", "-5"],
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "52rem", display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Empty Staging Template (5 Rows)</h5>
        <BatchEntryForm
          columns={["Item No", "Qty", "Unit Price", "Tax Code", "Total"]}
          initialRows={5}
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Pre-populated Ledger Entries</h5>
        <BatchEntryForm
          columns={["Account #", "Cost Center", "Debit (USD)", "Credit (USD)"]}
          initialData={[
            ["1010-CASH", "CORP-HQ", "12,500.00", "0.00"],
            ["4010-REV", "SALES-US", "0.00", "12,500.00"],
          ]}
        />
      </div>
    </div>
  ),
};
