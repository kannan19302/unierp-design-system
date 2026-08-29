import type { Meta, StoryObj } from "@storybook/react";
import { SchemaForm, type FormSectionSchema } from "./schema-form";

const meta: Meta<typeof SchemaForm> = {
  title: "FormEngine/SchemaForm",
  component: SchemaForm,
  parameters: {
    layout: "padded",
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
      alert(`Form submitted with payload:\n${JSON.stringify(data, null, 2)}`);
    },
  },
};
