import type { Meta, StoryObj } from "@storybook/react";
import { FieldValidationSummary } from "./field-validation-summary";

const sampleErrors = [
  { fieldKey: "email", fieldLabel: "Email", message: "Email address is required" },
  { fieldKey: "amount", fieldLabel: "Amount", message: "Must be greater than 0" },
  { fieldKey: "date", fieldLabel: "Due Date", message: "Date cannot be in the past" },
];

const meta: Meta<typeof FieldValidationSummary> = {
  title: "Forms/FieldValidationSummary",
  component: FieldValidationSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Consolidated diagnostic error panel aggregating field-level validation failures with direct jump anchors and 4-tier density scaling.",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling mode",
    },
    onErrorClick: {
      action: "errorClicked",
      description: "Callback invoked when clicking an error link",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FieldValidationSummary>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", padding: "var(--space-4)" }}>
      <FieldValidationSummary errors={sampleErrors} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", inlineSize: "38rem" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density}>
          <h5 style={{ marginBlockEnd: "var(--space-2)", textTransform: "capitalize" }}>
            Density: {density}
          </h5>
          <FieldValidationSummary density={density} errors={sampleErrors} />
        </div>
      ))}
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", inlineSize: "38rem" }}>
      <h4>Validation Summary Anatomy</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>
        Summarizes multiple form validation errors with interactive links that can focus or scroll to the target input field.
      </p>
      <FieldValidationSummary
        errors={[
          { fieldKey: "vendor", fieldLabel: "Vendor Code", message: "Vendor record not found in directory" },
          { fieldKey: "routing", fieldLabel: "Routing Number", message: "Must be a 9-digit ACH routing code" },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", inlineSize: "38rem" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Multiple Validation Failures</h5>
        <FieldValidationSummary
          errors={[
            { fieldKey: "email", fieldLabel: "Email", message: "Email address is required" },
            {
              fieldKey: "amount",
              fieldLabel: "Disbursement Amount",
              message: "Amount exceeds remaining purchase order balance ($1,400.00)",
            },
            { fieldKey: "date", fieldLabel: "Due Date", message: "Date cannot be in a closed fiscal period" },
          ]}
        />
      </div>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Single Field Error</h5>
        <FieldValidationSummary
          errors={[
            {
              fieldKey: "taxId",
              fieldLabel: "Tax Identification Number",
              message: "TIN format invalid for jurisdiction US",
            },
          ]}
        />
      </div>
    </div>
  ),
};
