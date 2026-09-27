import type { Meta, StoryObj } from "@storybook/react";
import { InlineEditableRecord } from "./inline-editable-record";

const sampleFields = [
  { key: "name", label: "Company Name", value: "Acme Corp", editable: true },
  { key: "email", label: "Contact Email", value: "billing@acme.com", editable: true },
  { key: "plan", label: "Subscription Plan", value: "Enterprise Plus", editable: true },
  { key: "id", label: "Account ID", value: "ACC-00472", editable: false },
];

const meta: Meta<typeof InlineEditableRecord> = {
  title: "Forms/InlineEditableRecord",
  component: InlineEditableRecord,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling mode",
    },
    onSave: {
      action: "recordSaved",
      description: "Callback invoked when saving modified record field",
    },
  },
};

export default meta;
type Story = StoryObj<typeof InlineEditableRecord>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", padding: "var(--space-4)" }}>
      <InlineEditableRecord fields={sampleFields} />
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
          <InlineEditableRecord density={density} fields={sampleFields} />
        </div>
      ))}
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Inline Record Anatomy</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>
        High-density key-value ledger rows with quick inline editing triggers, committing mutations without leaving context.
      </p>
      <InlineEditableRecord
        fields={[
          { key: "taxId", label: "Tax ID / VAT", value: "US-987654321", editable: true },
          { key: "currency", label: "Base Currency", value: "USD ($)", editable: false },
          { key: "fiscalYear", label: "Fiscal Year End", value: "December 31", editable: true },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Mixed Read-Only and Editable</h5>
        <InlineEditableRecord fields={sampleFields} />
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>All Read-Only (Non-editable)</h5>
        <InlineEditableRecord
          fields={[
            { key: "created", label: "Created Date", value: "2026-01-15", editable: false },
            { key: "creator", label: "Created By", value: "System Migration", editable: false },
          ]}
        />
      </div>
    </div>
  ),
};
