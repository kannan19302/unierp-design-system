import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ColumnPicker } from "./column-picker";

const sampleOptions = [
  { key: "id", label: "Invoice #" },
  { key: "name", label: "Client" },
  { key: "status", label: "Status" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Issue Date" },
];

const ColumnPickerDemo = () => {
  const [visible, setVisible] = useState(["id", "name", "status"]);

  return (
    <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ColumnPicker options={sampleOptions} visible={visible} onChange={setVisible} />
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
        Visible columns: <code>{visible.join(", ")}</code>
      </div>
    </div>
  );
};

const meta: Meta<typeof ColumnPicker> = {
  title: "DataGrid/ColumnPicker",
  component: ColumnPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ColumnPicker>;

export const Default: Story = {
  render: () => <ColumnPickerDemo />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <h3>Column Visibility Picker Anatomy</h3>
      <ColumnPickerDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4>Default State</h4>
        <ColumnPicker
          options={sampleOptions}
          visible={["id", "name", "amount"]}
          onChange={() => {}}
        />
      </div>
      <div>
        <h4>Custom Label</h4>
        <ColumnPicker
          options={sampleOptions}
          visible={["name", "status"]}
          onChange={() => {}}
          label="Select Table Columns"
        />
      </div>
    </div>
  ),
};
