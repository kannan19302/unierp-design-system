import type { Meta, StoryObj } from "@storybook/react";
import { RepeatableSectionEngine } from "./repeatable-section-engine";

/**
 * RepeatableSectionEngine facilitates dynamic multi-entry form records
 * such as contacts, line items, and addresses within Strata DL V1 forms.
 */
const meta: Meta<typeof RepeatableSectionEngine> = {
  title: "Core/Forms/RepeatableSectionEngine",
  component: RepeatableSectionEngine,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "RepeatableSectionEngine provides an accessible container for dynamic multi-entry forms, supporting adding, removing, and indexing repeatable field groups.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RepeatableSectionEngine>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 640, padding: "var(--space-4)" }}>
      <RepeatableSectionEngine
        sectionLabel="Contact"
        fieldLabels={["First Name", "Last Name", "Email", "Phone", "Role"]}
      />
    </div>
  ),
};

export const LineItems: Story = {
  render: () => (
    <div style={{ width: 640, padding: "var(--space-4)" }}>
      <RepeatableSectionEngine
        sectionLabel="Invoice Line Item"
        fieldLabels={["SKU", "Description", "Quantity", "Unit Price", "Tax Code"]}
        maxSections={5}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 640, padding: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Single Section / Contacts
        </h4>
        <RepeatableSectionEngine
          sectionLabel="Contact"
          fieldLabels={["Full Name", "Work Email", "Job Title"]}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Max Sections Limit (2 Sections Max)
        </h4>
        <RepeatableSectionEngine
          sectionLabel="Emergency Contact"
          fieldLabels={["Name", "Relationship", "Phone"]}
          maxSections={2}
        />
      </div>
    </div>
  ),
};
