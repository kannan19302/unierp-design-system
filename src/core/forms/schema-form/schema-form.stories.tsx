import type { Meta, StoryObj } from "@storybook/react";
import { SchemaForm, type FormSectionSchema } from "./schema-form";

/**
 * `<SchemaForm>` is an enterprise schema-driven form engine supporting 14 dynamic field types,
 * 12-column responsive layout, collapsible sections, conditional visibility, and inline validation.
 */
const meta: Meta<typeof SchemaForm> = {
  title: "Core/Forms/SchemaForm",
  component: SchemaForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Enterprise schema-driven form engine. Configured via declarative JSON schemas with built-in validation, responsive 12-column grid, collapsible sections, and state management.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SchemaForm>;

const sampleSections: FormSectionSchema[] = [
  {
    id: "organization",
    title: "Organization Profile",
    description: "Core corporate registry and accounting configuration.",
    fields: [
      {
        name: "companyName",
        label: "Legal Entity Name",
        type: "text",
        placeholder: "Acme Holdings Ltd.",
        required: true,
        colSpan: 8,
      },
      {
        name: "taxId",
        label: "Tax ID / EIN",
        type: "text",
        placeholder: "XX-XXXXXXX",
        required: true,
        colSpan: 4,
      },
      {
        name: "currency",
        label: "Reporting Currency",
        type: "select",
        options: [
          { label: "USD ($)", value: "USD" },
          { label: "EUR (€)", value: "EUR" },
          { label: "GBP (£)", value: "GBP" },
          { label: "SGD ($)", value: "SGD" },
        ],
        defaultValue: "USD",
        colSpan: 6,
      },
      {
        name: "fiscalYearEnd",
        label: "Fiscal Year End",
        type: "date",
        colSpan: 6,
      },
    ],
  },
  {
    id: "tier",
    title: "Subscription & Quotas",
    collapsible: true,
    fields: [
      {
        name: "tierPlan",
        label: "Tier Plan",
        type: "select",
        options: [
          { label: "Standard Tier", value: "standard" },
          { label: "Enterprise Tier", value: "enterprise" },
        ],
        defaultValue: "enterprise",
        colSpan: 6,
      },
      {
        name: "allocatedSeats",
        label: "Allocated Seat Licenses",
        type: "number",
        defaultValue: 50,
        colSpan: 6,
      },
      {
        name: "dedicatedVpc",
        label: "Enable Dedicated VPC Isolation",
        type: "switch",
        defaultValue: true,
        colSpan: 12,
        showIf: (values) => values.tierPlan === "enterprise",
      },
    ],
  },
];

export const Default: Story = {
  args: {
    sections: sampleSections,
    onSubmit: async (data) => {
      console.log("Form submitted:", data);
    },
  },
};

export const LoadingState: Story = {
  args: {
    sections: sampleSections,
    loading: true,
    onSubmit: async () => {},
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", maxWidth: 900 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Standard Multi-Section Enterprise Schema Form
        </h4>
        <SchemaForm
          sections={sampleSections}
          onSubmit={async (data) => console.log(data)}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-3)", fontSize: "var(--text-sm)", color: "var(--color-fg-muted)" }}>
          Compact Single-Section Form
        </h4>
        <SchemaForm
          sections={[
            {
              id: "quickContact",
              title: "Quick Contact",
              fields: [
                { name: "name", label: "Full Name", type: "text", required: true, colSpan: 6 },
                { name: "email", label: "Email Address", type: "email", required: true, colSpan: 6 },
              ],
            },
          ]}
          submitLabel="Save Contact"
          onSubmit={async (data) => console.log(data)}
        />
      </div>
    </div>
  ),
};
