import type { Meta, StoryObj } from "@storybook/react";
import { InlineEditableRecord } from "./inline-editable-record";

const sampleFields = [
  { key: "name", label: "Company Name", value: "Acme Corp", editable: true },
  { key: "email", label: "Contact Email", value: "billing@acme.com", editable: true },
  { key: "plan", label: "Subscription Plan", value: "Enterprise Plus", editable: true },
  { key: "id", label: "Account ID", value: "ACC-00472", editable: false },
];

const meta: Meta<typeof InlineEditableRecord> = {
  title: "Core/Forms/InlineEditableRecord",
  component: InlineEditableRecord,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof InlineEditableRecord>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 600, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <InlineEditableRecord fields={sampleFields} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
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
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Mixed Read-Only and Editable
        </h4>
        <InlineEditableRecord fields={sampleFields} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          All Read-Only (Non-editable)
        </h4>
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
