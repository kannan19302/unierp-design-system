import type { Meta, StoryObj } from "@storybook/react";
import { ConditionalFieldGroup } from "./conditional-field-group";

const meta: Meta<typeof ConditionalFieldGroup> = {
  title: "Forms/ConditionalFieldGroup",
  component: ConditionalFieldGroup,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof ConditionalFieldGroup>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <ConditionalFieldGroup triggerLabel="Payment Method" triggerOptions={['Wire Transfer', 'Credit Card', 'ACH']} groups={{ 'Wire Transfer': <div>Bank Name, Routing Number, Account Number fields</div>, 'Credit Card': <div>Card Number, Expiry, CVV fields</div>, 'ACH': <div>Bank, Account, Routing fields</div> }} />
    </div>
  ),
};
