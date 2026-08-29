import type { Meta, StoryObj } from "@storybook/react";
import { ChangeHistory, type ChangeEntry } from "./change-history";

const MOCK_ENTRIES: ChangeEntry[] = [
  {
    id: "ch-1",
    userId: "usr-1",
    userName: "Alice Chen",
    action: "CREATE",
    createdAt: "2026-05-01T09:00:00Z",
  },
  {
    id: "ch-2",
    userId: "usr-2",
    userName: "Bob Smith",
    action: "UPDATE",
    fieldChanges: [
      { field: "amount", label: "Invoice Amount", oldValue: "$10,000", newValue: "$12,500" },
      { field: "terms", label: "Payment Terms", oldValue: "Net 30", newValue: "Net 15" },
    ],
    createdAt: "2026-05-02T11:20:00Z",
  },
  {
    id: "ch-3",
    userId: "usr-1",
    userName: "Alice Chen",
    action: "STATUS_CHANGE",
    fieldChanges: [
      { field: "status", label: "Workflow State", oldValue: "Pending", newValue: "Approved" },
    ],
    createdAt: "2026-05-03T16:45:00Z",
  },
];

const meta: Meta<typeof ChangeHistory> = {
  title: "DataGrid/ChangeHistory",
  component: ChangeHistory,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ChangeHistory>;

export const Default: Story = {
  args: {
    entityType: "invoice",
    entityId: "inv-2026",
    initialEntries: MOCK_ENTRIES,
  },
};
