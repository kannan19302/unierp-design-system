import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent, Collapsible } from "./accordion";

const meta: Meta<typeof Accordion> = {
  title: "Compositions/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    type: {
      control: "select",
      options: ["single", "multiple"],
      description: "Whether single or multiple panels can be expanded simultaneously.",
    },
  },
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
    density: "standard",
    type: "single",
  },
  render: (args) => (
    <div style={{ inlineSize: "500px" }}>
      <Accordion {...args} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", inlineSize: "500px" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Ultra-compact (24px)</p>
        <Accordion items={items} density="ultra-compact" defaultOpenKey="tax" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Compact (28px)</p>
        <Accordion items={items} density="compact" defaultOpenKey="tax" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Standard (32px)</p>
        <Accordion items={items} density="standard" defaultOpenKey="tax" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Comfortable (40px)</p>
        <Accordion items={items} density="comfortable" defaultOpenKey="tax" />
      </div>
    </div>
  ),
};

export const CompoundComponents: Story = {
  render: () => (
    <div style={{ inlineSize: "500px" }}>
      <Accordion defaultValue="tax" type="multiple">
        <AccordionItem value="tax">
          <AccordionTrigger>Regional Tax Schemes</AccordionTrigger>
          <AccordionContent>Tax rates computed via jurisdiction mapping tables.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="coa">
          <AccordionTrigger>General Ledger Accounts</AccordionTrigger>
          <AccordionContent>Automated multi-currency posting rules configured for FY2026.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const CollapsibleDisclosure: Story = {
  render: () => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
      <Collapsible title="Advanced Posting Configuration" defaultOpen={false}>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Enable dual-currency sub-ledger revaluation and daily exchange rate feeds.
        </p>
      </Collapsible>
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  args: {
    items,
    defaultOpenKey: "coa",
  },
  render: (args) => (
    <div style={{ inlineSize: "500px" }}>
      <Accordion {...args} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem", inlineSize: "500px" }}>
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
