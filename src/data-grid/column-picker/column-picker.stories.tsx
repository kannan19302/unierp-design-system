import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColumnPicker } from "./column-picker";

const ColumnPickerDemo = () => {
  const [visible, setVisible] = useState(["id", "name", "status"]);
  const options = [
    { key: "id", label: "Invoice #" },
    { key: "name", label: "Client" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
    { key: "date", label: "Issue Date" },
  ];

  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ColumnPicker options={options} visible={visible} onChange={setVisible} />
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Visible columns: <code>{visible.join(", ")}</code>
      </div>
    </div>
  );
};

const meta: Meta<typeof ColumnPicker> = {
  title: "DataGrid/ColumnPicker",
  component: ColumnPickerDemo,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => <ColumnPickerDemo />,
};
