import type { Meta, StoryObj } from "@storybook/react";
import { FormFieldVisibilityEngine } from "./form-field-visibility-engine";

const meta: Meta<typeof FormFieldVisibilityEngine> = {
  title: "FormEngine/FormFieldVisibilityEngine",
  component: FormFieldVisibilityEngine,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FormFieldVisibilityEngine>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FormFieldVisibilityEngine fields={[{ key: 'type' }, { key: 'bankName', visibleWhen: { field: 'type', equals: 'wire' } }, { key: 'cardNumber', visibleWhen: { field: 'type', equals: 'card' } }]} values={{ type: 'wire' }}>{(keys) => <div style={{ padding: 'var(--space-4)' }}>Visible fields: {keys.join(', ')}</div>}</FormFieldVisibilityEngine>
    </div>
  ),
};
