import type { Meta, StoryObj } from "@storybook/react";
import { ActionBar } from "./action-bar";
import { Plus, Download, Printer, Trash2 } from "lucide-react";

const meta: Meta<typeof ActionBar> = {
  title: "Components/ActionBar",
  component: ActionBar,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ActionBar>;

export const Default: Story = {
  args: {
    primaryAction: {
      label: "New Invoice",
      icon: <Plus size={16} />,
      onClick: () => alert("Create Invoice"),
    },
    secondaryActions: [
      {
        label: "Export CSV",
        icon: <Download size={16} />,
        onClick: () => alert("Export"),
      },
      {
        label: "Print",
        icon: <Printer size={16} />,
        onClick: () => alert("Print"),
      },
    ],
    aiAction: {
      label: "Auto-Reconcile with AI",
      onClick: () => alert("AI Reconcile"),
    },
    overflowActions: [
      {
        label: "Delete Drafts",
        icon: <Trash2 size={16} />,
        onClick: () => alert("Delete"),
        danger: true,
      },
    ],
  },
};
