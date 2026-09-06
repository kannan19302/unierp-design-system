import type { Meta, StoryObj } from "@storybook/react";
import { HierarchicalPickerForm } from "./hierarchical-picker-form";

const meta: Meta<typeof HierarchicalPickerForm> = {
  title: "Forms/HierarchicalPickerForm",
  component: HierarchicalPickerForm,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof HierarchicalPickerForm>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <HierarchicalPickerForm levels={[{ label: 'Department', options: { _root: ['Engineering', 'Sales', 'Finance'] } }, { label: 'Team', options: { Engineering: ['Frontend', 'Backend', 'DevOps'], Sales: ['Enterprise', 'SMB'], Finance: ['AP', 'AR', 'Treasury'] } }]} />
    </div>
  ),
};
