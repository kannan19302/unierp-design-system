import type { Meta, StoryObj } from "@storybook/react";
import { DescriptionList } from "./description-list";

const meta: Meta<typeof DescriptionList> = {
  title: "DataDisplay/DescriptionList",
  component: DescriptionList,
  tags: ["autodocs"],
  argTypes: {
    columns: {
      control: "select",
      options: [1, 2, 3],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DescriptionList>;

export const Default: Story = {
  args: {
    columns: 2,
    items: [
      { label: "Entity Legal Name", value: "Acme Holdings International LLC" },
      { label: "Tax Identification", value: "US-EIN-98-1234567" },
      { label: "Base Ledger Currency", value: "USD ($)" },
      { label: "Current Fiscal Year", value: "FY2026 (Open)" },
      { label: "Audit Standard", value: "IFRS-9 / GAAP Compliant" },
      { label: "Last Reconciled", value: "2026-08-28 23:59:59" },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>1 Column Layout</h4>
        <DescriptionList
          columns={1}
          items={[
            { label: "Company", value: "Acme Corp" },
            { label: "Status", value: "Active" },
          ]}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>2 Column Layout</h4>
        <DescriptionList
          columns={2}
          items={[
            { label: "Company", value: "Acme Corp" },
            { label: "Status", value: "Active" },
            { label: "Plan", value: "Enterprise" },
            { label: "Seats", value: "250" },
          ]}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>3 Column Layout</h4>
        <DescriptionList
          columns={3}
          items={[
            { label: "Company", value: "Acme Corp" },
            { label: "Status", value: "Active" },
            { label: "Plan", value: "Enterprise" },
            { label: "Seats", value: "250" },
            { label: "Region", value: "US-East" },
            { label: "Tier", value: "Tier 1" },
          ]}
        />
      </div>
    </div>
  ),
};
