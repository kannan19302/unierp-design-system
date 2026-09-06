import type { Meta, StoryObj } from "@storybook/react";
import { RepeatableSectionEngine } from "./repeatable-section-engine";

const meta: Meta<typeof RepeatableSectionEngine> = {
  title: "FormEngine/RepeatableSectionEngine",
  component: RepeatableSectionEngine,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof RepeatableSectionEngine>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 600, padding: "var(--space-4)" }}>
      <RepeatableSectionEngine sectionLabel="Contact" fieldLabels={['First Name', 'Last Name', 'Email', 'Phone', 'Role']} />
    </div>
  ),
};
