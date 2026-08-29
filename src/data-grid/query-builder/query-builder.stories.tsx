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
  title: "DataGrid/QueryBuilder",
  component: QueryBuilder,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof QueryBuilder>;

export const Default: Story = {
  args: {
    fields: sampleFields,
    showPreview: true,
  },
};
