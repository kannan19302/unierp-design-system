import type { Meta, StoryObj } from "@storybook/react";
import { MultiStepTransactionForm } from "./multi-step-transaction-form";

const sampleSteps = [
  {
    id: "details",
    label: "Transaction Details",
    content: (
      <div style={{ color: "var(--color-text-secondary)" }}>
        Step 1: Specify transaction type, reference identifier, and currency code.
      </div>
    ),
  },
  {
    id: "allocation",
    label: "Cost Center Allocation",
    content: (
      <div style={{ color: "var(--color-text-secondary)" }}>
        Step 2: Assign department accounts, tax percentages, and cost centers.
      </div>
    ),
  },
  {
    id: "review",
    label: "Audit & Review",
    content: (
      <div style={{ color: "var(--color-text-secondary)" }}>
        Step 3: Verify line items, compliance notes, and dual-control sign-offs.
      </div>
    ),
  },
  {
    id: "confirm",
    label: "Posting Confirmation",
    content: (
      <div style={{ color: "var(--color-text-secondary)" }}>
        Step 4: Confirm immutable ledger posting and notify downstream stakeholders.
      </div>
    ),
  },
];

const meta: Meta<typeof MultiStepTransactionForm> = {
  title: "Forms/MultiStepTransactionForm",
  component: MultiStepTransactionForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof MultiStepTransactionForm>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 620, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <MultiStepTransactionForm steps={sampleSteps} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 620, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <MultiStepTransactionForm
        steps={[
          {
            id: "step-1",
            label: "Invoice Header",
            content: <div>Enter customer PO and billing addresses.</div>,
          },
          {
            id: "step-2",
            label: "Line Items",
            content: <div>Add SKU rows, unit quantities, and applicable discounts.</div>,
          },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 620, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Initial Step (First Step Active)
        </h4>
        <MultiStepTransactionForm steps={sampleSteps} initialStepIndex={0} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Intermediate Step (Mid-flow)
        </h4>
        <MultiStepTransactionForm steps={sampleSteps} initialStepIndex={2} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Final Step (Ready for Post/Submit)
        </h4>
        <MultiStepTransactionForm steps={sampleSteps} initialStepIndex={3} />
      </div>
    </div>
  ),
};
