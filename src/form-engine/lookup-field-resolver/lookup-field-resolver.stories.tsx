import type { Meta, StoryObj } from "@storybook/react";
import { LookupFieldResolver } from "./lookup-field-resolver";

const meta: Meta<typeof LookupFieldResolver> = {
  title: "FormEngine/LookupFieldResolver",
  component: LookupFieldResolver,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof LookupFieldResolver>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <LookupFieldResolver label="Customer" placeholder="Search customers..." results={[{ id: '1', label: 'Acme Corporation', subtitle: 'ACC-001 • Enterprise' }, { id: '2', label: 'GlobalTech Inc', subtitle: 'ACC-002 • SMB' }]} />
    </div>
  ),
};
