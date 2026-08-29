import type { Meta, StoryObj } from "@storybook/react";
import { ActionBar } from "./action-bar";
import { Plus, Download, Printer } from "lucide-react";
import { Button } from "../../primitives/button";

const meta: Meta<typeof ActionBar> = {
  title: "Forms/ActionBar",
  component: ActionBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

export const Default: Story = {
  args: {
    primaryAction: {
      key: "new",
      label: "New Journal Voucher",
      icon: <Plus size={14} />,
      onClick: () => alert("New Voucher"),
    },
    secondaryActions: [
      { key: "export", label: "Export CSV", icon: <Download size={14} /> },
      { key: "print", label: "Print Trial Balance", icon: <Printer size={14} /> },
    ],
    aiAction: {
      key: "ai_reconcile",
      label: "Auto-Match Invoices (AI)",
      onClick: () => alert("AI Reconcile"),
    },
  },
};

export const BulkMode: Story = {
  args: {
    selectedCount: 8,
    onClearSelection: () => alert("Deselected"),
    bulkActions: (
      <>
        <Button variant="danger" size="sm">Delete Selected</Button>
        <Button variant="primary" size="sm">Post Batch</Button>
      </>
    ),
  },
};
