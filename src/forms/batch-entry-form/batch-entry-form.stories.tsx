import type { Meta, StoryObj } from "@storybook/react";
import { BatchEntryForm } from "./batch-entry-form";

const meta: Meta<typeof BatchEntryForm> = {
  title: "Forms/BatchEntryForm",
  component: BatchEntryForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof BatchEntryForm>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <BatchEntryForm columns={['Date', 'Description', 'Debit', 'Credit', 'Account']} />
    </div>
  ),
};
