import type { Meta, StoryObj } from "@storybook/react";
import { RepeaterFieldGroup } from "./repeater-field-group";

const meta: Meta<typeof RepeaterFieldGroup> = {
  title: "Forms/RepeaterFieldGroup",
  component: RepeaterFieldGroup,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof RepeaterFieldGroup>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <RepeaterFieldGroup label="Line Items" fields={['Description', 'Qty', 'Unit Price', 'Amount']} />
    </div>
  ),
};
