import type { Meta, StoryObj } from "@storybook/react";
import { CalculatedFieldDisplay } from "./calculated-field-display";

const meta: Meta<typeof CalculatedFieldDisplay> = {
  title: "FormEngine/CalculatedFieldDisplay",
  component: CalculatedFieldDisplay,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof CalculatedFieldDisplay>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <CalculatedFieldDisplay label="Grand Total" formula="Subtotal + Tax - Discount" value="$1,247.50" breakdown={[{ label: 'Subtotal', value: '$1,200.00' }, { label: 'Tax (8.25%)', value: '$99.00' }, { label: 'Discount', value: '-$51.50' }]} />
    </div>
  ),
};
