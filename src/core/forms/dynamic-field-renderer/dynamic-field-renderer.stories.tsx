import type { Meta, StoryObj } from "@storybook/react";
import { DynamicFieldRenderer } from "./dynamic-field-renderer";

const meta: Meta<typeof DynamicFieldRenderer> = {
  title: "Core/Forms/DynamicFieldRenderer",
  component: DynamicFieldRenderer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Metadata-driven form engine that dynamically instantiates typed inputs, date pickers, selects, and textareas from JSON schemas.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicFieldRenderer>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <DynamicFieldRenderer
        schema={[
          { key: "name", label: "Full Name", type: "text", required: true },
          { key: "email", label: "Email", type: "text", required: true },
          { key: "dept", label: "Department", type: "select", options: ["Engineering", "Sales", "Finance"] },
          { key: "startDate", label: "Start Date", type: "date" },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 600 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Multi-type Form Schema
        </h4>
        <DynamicFieldRenderer
          schema={[
            { key: "vendorName", label: "Vendor Entity Name", type: "text", required: true },
            { key: "taxId", label: "Tax Identification Number (TIN)", type: "text", required: true },
            { key: "currency", label: "Settlement Currency", type: "select", options: ["USD", "EUR", "GBP", "SGD"] },
          ]}
        />
      </div>
    </div>
  ),
};
