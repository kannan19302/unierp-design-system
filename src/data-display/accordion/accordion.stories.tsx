import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "DataDisplay/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: [
      { key: "tax", title: "Tax Configuration (GST/VAT)", content: "Manage regional tax rules, exemption flags, and reverse charges." },
      { key: "coa", title: "Chart of Accounts Mapping", content: "Map assets, liabilities, equities, revenues, and expenses." },
      { key: "audit", title: "Compliance & Audit Lock", content: "Set auto-close dates and multi-signature approvals." },
    ],
  },
};
