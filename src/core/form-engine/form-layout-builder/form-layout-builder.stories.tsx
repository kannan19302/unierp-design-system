import type { Meta, StoryObj } from "@storybook/react";
import { FormLayoutBuilder } from "./form-layout-builder";

const meta: Meta<typeof FormLayoutBuilder> = {
  title: "FormEngine/FormLayoutBuilder",
  component: FormLayoutBuilder,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FormLayoutBuilder>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FormLayoutBuilder sections={[{ id: 's1', label: 'Contact Info', columns: 2, fields: ['First Name', 'Last Name', 'Email', 'Phone'] }, { id: 's2', label: 'Address', columns: 3, fields: ['Street', 'City', 'State', 'ZIP', 'Country'] }, { id: 's3', label: 'Notes', columns: 1, fields: ['Internal Notes'] }]} />
    </div>
  ),
};
