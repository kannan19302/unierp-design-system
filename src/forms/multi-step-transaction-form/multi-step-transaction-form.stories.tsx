import type { Meta, StoryObj } from "@storybook/react";
import { MultiStepTransactionForm } from "./multi-step-transaction-form";

const meta: Meta<typeof MultiStepTransactionForm> = {
  title: "Forms/MultiStepTransactionForm",
  component: MultiStepTransactionForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof MultiStepTransactionForm>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <MultiStepTransactionForm steps={[{ id: 'details', label: 'Details', content: <div>Step 1: Enter transaction details</div> }, { id: 'review', label: 'Review', content: <div>Step 2: Review information</div> }, { id: 'confirm', label: 'Confirm', content: <div>Step 3: Confirm and submit</div> }]} />
    </div>
  ),
};
