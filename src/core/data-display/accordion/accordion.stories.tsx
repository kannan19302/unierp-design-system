import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Data Display/Accordion",
  component: Accordion,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const items = [
  { key: "tax", title: "Tax Configuration (GST/VAT)", content: "Manage regional tax rules, exemption flags, and reverse charges." },
  { key: "coa", title: "Chart of Accounts Mapping", content: "Map assets, liabilities, equities, revenues, and expenses." },
  { key: "audit", title: "Compliance & Audit Lock", content: "Set auto-close dates and multi-signature approvals." },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    items,
    defaultOpenKey: "coa",
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", inlineSize: "100%", maxInlineSize: 600 }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>First Item Open (Default)</h4>
        <Accordion items={items} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>All Collapsed Initially</h4>
        <Accordion items={items} defaultOpenKey={null} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Middle Item Open</h4>
        <Accordion items={items} defaultOpenKey="coa" />
      </div>
    </div>
  ),
};
