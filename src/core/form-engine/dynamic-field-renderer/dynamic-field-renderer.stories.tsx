import type { Meta, StoryObj } from "@storybook/react";
import { DynamicFieldRenderer } from "./dynamic-field-renderer";

const meta: Meta<typeof DynamicFieldRenderer> = {
  title: "FormEngine/DynamicFieldRenderer",
  component: DynamicFieldRenderer,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof DynamicFieldRenderer>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <DynamicFieldRenderer schema={[{ key: 'name', label: 'Full Name', type: 'text', required: true }, { key: 'email', label: 'Email', type: 'text', required: true }, { key: 'dept', label: 'Department', type: 'select', options: ['Engineering', 'Sales', 'Finance'] }, { key: 'startDate', label: 'Start Date', type: 'date' }, { key: 'notes', label: 'Notes', type: 'textarea' }]} />
    </div>
  ),
};
