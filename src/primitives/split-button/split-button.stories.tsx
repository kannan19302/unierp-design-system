import type { Meta, StoryObj } from "@storybook/react";
import { Save, Download, Printer, Share2, Trash2 } from "lucide-react";
import { SplitButton } from "./split-button";

const meta: Meta<typeof SplitButton> = {
  title: "Primitives/SplitButton",
  component: SplitButton,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {
  args: {
    label: "Save & Publish",
    icon: <Save size={14} />,
    onClick: () => alert("Primary Save clicked"),
    items: [
      { id: "draft", label: "Save as Draft", onClick: () => alert("Draft saved") },
      { id: "template", label: "Save as Template", onClick: () => alert("Template saved") },
      { id: "export", label: "Export to JSON", icon: <Download size={14} />, onClick: () => alert("Exported") },
    ],
  },
};

export const SecondaryVariant: Story = {
  args: {
    label: "Export Report",
    variant: "secondary",
    icon: <Download size={14} />,
    onClick: () => alert("Export clicked"),
    items: [
      { id: "pdf", label: "Print to PDF", icon: <Printer size={14} />, onClick: () => alert("PDF") },
      { id: "share", label: "Share via Link", icon: <Share2 size={14} />, onClick: () => alert("Shared") },
    ],
  },
};

export const DangerVariant: Story = {
  args: {
    label: "Delete Record",
    variant: "danger",
    icon: <Trash2 size={14} />,
    onClick: () => alert("Delete clicked"),
    items: [
      { id: "archive", label: "Archive Instead", onClick: () => alert("Archived") },
      { id: "purge", label: "Permanently Purge", danger: true, onClick: () => alert("Purged") },
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: "Locked Action",
    disabled: true,
    onClick: () => {},
    items: [{ id: "1", label: "Item 1", onClick: () => {} }],
  },
};
