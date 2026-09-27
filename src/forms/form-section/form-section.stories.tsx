import type { Meta, StoryObj } from "@storybook/react";
import { FormLayoutBuilder } from "./form-section";

const sampleSections = [
  { id: "s1", label: "Contact Info", columns: 2, fields: ["First Name", "Last Name", "Email", "Phone"] },
  { id: "s2", label: "Address", columns: 3, fields: ["Street", "City", "State", "ZIP", "Country"] },
  { id: "s3", label: "Notes", columns: 1, fields: ["Internal Notes"] },
];

const meta: Meta<typeof FormLayoutBuilder> = {
  title: "Forms/FormLayoutBuilder",
  component: FormLayoutBuilder,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Visual multi-column section and grid layout organizer for complex ERP master-detail and transaction records.",
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling mode",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormLayoutBuilder>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", padding: "var(--space-4)" }}>
      <FormLayoutBuilder sections={sampleSections} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", inlineSize: "38rem" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density}>
          <h5 style={{ marginBlockEnd: "var(--space-2)", textTransform: "capitalize" }}>
            Density: {density}
          </h5>
          <FormLayoutBuilder density={density} sections={sampleSections} />
        </div>
      ))}
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", inlineSize: "38rem" }}>
      <h4>Form Section Anatomy</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>
        Organizes form field groups into multi-column responsive grid structures with visual section titles and badges.
      </p>
      <FormLayoutBuilder
        sections={[
          {
            id: "billing",
            label: "Billing Terms",
            columns: 2,
            fields: ["Payment Method", "Currency", "Tax Schedule", "Discount Code"],
          },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", inlineSize: "38rem" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Multi-section Form Floorplan</h5>
        <FormLayoutBuilder
          sections={[
            {
              id: "header",
              label: "Header Information",
              columns: 2,
              fields: ["Customer Account", "Invoice Date", "Payment Terms", "Currency"],
            },
            { id: "lines", label: "Line Summary", columns: 1, fields: ["Item Breakdown Table"] },
          ]}
        />
      </div>
    </div>
  ),
};
