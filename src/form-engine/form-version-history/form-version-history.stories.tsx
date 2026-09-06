import type { Meta, StoryObj } from "@storybook/react";
import { FormVersionHistory } from "./form-version-history";

const meta: Meta<typeof FormVersionHistory> = {
  title: "FormEngine/FormVersionHistory",
  component: FormVersionHistory,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof FormVersionHistory>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <FormVersionHistory versions={[{ id: 'v3', timestamp: '2026-09-06 12:00', author: 'John Smith', changes: 'Updated payment terms to Net 30', isCurrent: true }, { id: 'v2', timestamp: '2026-09-05 15:30', author: 'Jane Doe', changes: 'Added line items 4-6' }, { id: 'v1', timestamp: '2026-09-04 09:00', author: 'John Smith', changes: 'Initial creation' }]} />
    </div>
  ),
};
