import type { Meta, StoryObj } from "@storybook/react";
import { QueryBuilder, type QueryField } from "./query-builder";

const sampleFields: QueryField[] = [
  { name: "accountCode", label: "Account Code", type: "string" },
  { name: "amount", label: "Transaction Amount", type: "number" },
  { name: "postingDate", label: "Posting Date", type: "date" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { label: "Draft", value: "DRAFT" },
      { label: "Pending Approval", value: "PENDING" },
      { label: "Posted", value: "POSTED" },
      { label: "Reconciled", value: "RECONCILED" },
    ],
  },
  { name: "isReconciled", label: "Is Reconciled", type: "boolean" },
];

const meta: Meta<typeof QueryBuilder> = {
  title: "Core/Data Grid/QueryBuilder",
  component: QueryBuilder,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {
  args: {
    fields: sampleFields,
    showPreview: true,
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Default Query Builder with SQL Preview</h4>
        <QueryBuilder fields={sampleFields} showPreview={true} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Query Builder without SQL Preview</h4>
        <QueryBuilder fields={sampleFields} showPreview={false} />
      </div>
    </div>
  ),
};
