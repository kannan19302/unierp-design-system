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
