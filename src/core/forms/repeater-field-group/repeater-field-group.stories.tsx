import type { Meta, StoryObj } from "@storybook/react";
import { RepeaterFieldGroup } from "./repeater-field-group";

const lineItemFields = ["SKU / Code", "Description", "Quantity", "Unit Price", "Tax %"];

const meta: Meta<typeof RepeaterFieldGroup> = {
  title: "Core/Forms/RepeaterFieldGroup",
  component: RepeaterFieldGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof RepeaterFieldGroup>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 720, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <RepeaterFieldGroup label="Line Items" fields={lineItemFields} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 620, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <RepeaterFieldGroup
        label="Shipping Addresses"
        fields={["Recipient", "Street Address", "City", "Postal Code"]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 720, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Empty / Single Row Default
        </h4>
        <RepeaterFieldGroup label="Custom Attributes" fields={["Key", "Value"]} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Prepopulated Rows
        </h4>
        <RepeaterFieldGroup
          label="Sales Invoice Items"
          fields={lineItemFields}
          initialRows={[
            {
              "SKU / Code": "SRV-001",
              Description: "Cloud Infrastructure Setup",
              Quantity: "1",
              "Unit Price": "$2,500.00",
              "Tax %": "8.25",
            },
            {
              "SKU / Code": "LIC-ENT",
              Description: "Annual Enterprise License",
              Quantity: "25",
              "Unit Price": "$450.00",
              "Tax %": "8.25",
            },
          ]}
        />
      </div>
    </div>
  ),
};
