import type { Meta, StoryObj } from "@storybook/react";
import { AddressAutoCompleteForm } from "./address-auto-complete-form";

const meta: Meta<typeof AddressAutoCompleteForm> = {
  title: "Forms/AddressAutoCompleteForm",
  component: AddressAutoCompleteForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AddressAutoCompleteForm>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <AddressAutoCompleteForm defaultCountry="US" />
    </div>
  ),
};
