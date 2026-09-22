import type { Meta, StoryObj } from "@storybook/react";
import { FieldValidationSummary } from "./field-validation-summary";

const meta: Meta<typeof FieldValidationSummary> = {
  title: "FormEngine/FieldValidationSummary",
  component: FieldValidationSummary,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FieldValidationSummary>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FieldValidationSummary errors={[{ fieldKey: 'email', fieldLabel: 'Email', message: 'Email address is required' }, { fieldKey: 'amount', fieldLabel: 'Amount', message: 'Must be greater than 0' }, { fieldKey: 'date', fieldLabel: 'Due Date', message: 'Date cannot be in the past' }]} />
    </div>
  ),
};
