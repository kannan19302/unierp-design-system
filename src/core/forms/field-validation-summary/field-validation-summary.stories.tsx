import type { Meta, StoryObj } from "@storybook/react";
import { FieldValidationSummary } from "./field-validation-summary";

const meta: Meta<typeof FieldValidationSummary> = {
  title: "Core/Forms/FieldValidationSummary",
  component: FieldValidationSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Consolidated diagnostic error panel aggregating field-level validation failures with direct jump anchors.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FieldValidationSummary>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FieldValidationSummary
        errors={[
          { fieldKey: "email", fieldLabel: "Email", message: "Email address is required" },
          { fieldKey: "amount", fieldLabel: "Amount", message: "Must be greater than 0" },
          { fieldKey: "date", fieldLabel: "Due Date", message: "Date cannot be in the past" },
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
          1. Multiple Validation Failures
        </h4>
        <FieldValidationSummary
          errors={[
            { fieldKey: "email", fieldLabel: "Email", message: "Email address is required" },
            { fieldKey: "amount", fieldLabel: "Disbursement Amount", message: "Amount exceeds remaining purchase order balance ($1,400.00)" },
            { fieldKey: "date", fieldLabel: "Due Date", message: "Date cannot be in a closed fiscal period" },
          ]}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Single Field Error
        </h4>
        <FieldValidationSummary
          errors={[
            { fieldKey: "taxId", fieldLabel: "Tax Identification Number", message: "TIN format invalid for jurisdiction US" },
          ]}
        />
      </div>
    </div>
  ),
};
