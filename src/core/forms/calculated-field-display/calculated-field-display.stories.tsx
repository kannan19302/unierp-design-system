import type { Meta, StoryObj } from "@storybook/react";
import { CalculatedFieldDisplay } from "./calculated-field-display";

const meta: Meta<typeof CalculatedFieldDisplay> = {
  title: "Core/Forms/CalculatedFieldDisplay",
  component: CalculatedFieldDisplay,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Visual audit display showing formula, live calculated result, and component breakdown for fiscal totals.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CalculatedFieldDisplay>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <CalculatedFieldDisplay
        label="Grand Total"
        formula="Subtotal + Tax - Discount"
        value="$1,247.50"
        breakdown={[
          { label: "Subtotal", value: "$1,200.00" },
          { label: "Tax (8.25%)", value: "$99.00" },
          { label: "Discount", value: "-$51.50" },
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
          1. Multi-tier Fiscal Breakdown
        </h4>
        <CalculatedFieldDisplay
          label="Grand Total"
          formula="Subtotal + Tax - Discount"
          value="$1,247.50"
          breakdown={[
            { label: "Subtotal", value: "$1,200.00" },
            { label: "Tax (8.25%)", value: "$99.00" },
            { label: "Discount", value: "-$51.50" },
          ]}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Simple Formula Without Breakdown
        </h4>
        <CalculatedFieldDisplay
          label="Net Operating Income"
          formula="Revenue - Expenses"
          value="$452,100.00"
        />
      </div>
    </div>
  ),
};
