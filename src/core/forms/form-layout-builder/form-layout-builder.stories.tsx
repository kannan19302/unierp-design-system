import type { Meta, StoryObj } from "@storybook/react";
import { FormLayoutBuilder } from "./form-layout-builder";

const meta: Meta<typeof FormLayoutBuilder> = {
  title: "Core/Forms/FormLayoutBuilder",
  component: FormLayoutBuilder,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Visual multi-column section and grid layout organizer for complex ERP master-detail and transaction records.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormLayoutBuilder>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FormLayoutBuilder
        sections={[
          { id: "s1", label: "Contact Info", columns: 2, fields: ["First Name", "Last Name", "Email", "Phone"] },
          { id: "s2", label: "Address", columns: 3, fields: ["Street", "City", "State", "ZIP", "Country"] },
          { id: "s3", label: "Notes", columns: 1, fields: ["Internal Notes"] },
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
          1. Multi-section Form Floorplan
        </h4>
        <FormLayoutBuilder
          sections={[
            { id: "header", label: "Header Information", columns: 2, fields: ["Customer Account", "Invoice Date", "Payment Terms", "Currency"] },
            { id: "lines", label: "Line Summary", columns: 1, fields: ["Item Breakdown Table"] },
          ]}
        />
      </div>
    </div>
  ),
};
