import type { Meta, StoryObj } from "@storybook/react";
import { InlineEditableRecord } from "./inline-editable-record";

const meta: Meta<typeof InlineEditableRecord> = {
  title: "Forms/InlineEditableRecord",
  component: InlineEditableRecord,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof InlineEditableRecord>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <InlineEditableRecord fields={[{ key: 'name', label: 'Company Name', value: 'Acme Corp', editable: true }, { key: 'email', label: 'Contact Email', value: 'billing@acme.com', editable: true }, { key: 'plan', label: 'Plan', value: 'Enterprise', editable: true }, { key: 'id', label: 'Account ID', value: 'ACC-00472', editable: false }]} />
    </div>
  ),
};
