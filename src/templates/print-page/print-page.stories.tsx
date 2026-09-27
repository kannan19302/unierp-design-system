import type { Meta, StoryObj } from "@storybook/react";
import { PrintLayout } from "./print-page";

const meta: Meta<typeof PrintLayout> = {
  title: "Templates/PrintLayout",
  component: PrintLayout,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PrintLayout>;

export const AnatomyAndComposition: Story = {
  render: (args) => <PrintLayout {...args} />,
  args: {
    children: (
      <div>
        <h2 style={{ marginBlockEnd: "12px", marginBlockStart: 0, marginInline: 0 }}>Formal General Ledger Statement</h2>
        <p style={{ marginBlockEnd: "8px", marginBlockStart: 0, marginInline: 0, color: "var(--color-text-secondary)" }}>
          Period ending August 31, 2026. Certified by external auditor.
        </p>
        <table style={{ inlineSize: "100%", borderCollapse: "collapse", marginBlockStart: "16px" }}>
          <thead>
            <tr style={{ borderBlockEnd: "2px solid var(--color-border-default)" }}>
              <th style={{ textAlign: "start", padding: "8px" }}>Account Code</th>
              <th style={{ textAlign: "start", padding: "8px" }}>Description</th>
              <th style={{ textAlign: "end", padding: "8px" }}>Debit</th>
              <th style={{ textAlign: "end", padding: "8px" }}>Credit</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBlockEnd: "1px solid var(--color-border-default)" }}>
              <td style={{ padding: "8px" }}>1000-CASH</td>
              <td style={{ padding: "8px" }}>Operating Cash Reserve</td>
              <td style={{ textAlign: "end", padding: "8px" }}>$450,000.00</td>
              <td style={{ textAlign: "end", padding: "8px" }}>—</td>
            </tr>
            <tr style={{ borderBlockEnd: "1px solid var(--color-border-default)" }}>
              <td style={{ padding: "8px" }}>2000-AP</td>
              <td style={{ padding: "8px" }}>Accounts Payable Trade</td>
              <td style={{ textAlign: "end", padding: "8px" }}>—</td>
              <td style={{ textAlign: "end", padding: "8px" }}>$450,000.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    ),
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBlockEnd: "8px", marginBlockStart: 0, marginInline: 0, color: "var(--color-text-primary)" }}>Standard Invoice Print Layout</h4>
        <PrintLayout>
          <h3>Commercial Invoice #INV-9021</h3>
          <p style={{ color: "var(--color-text-secondary)" }}>Bill To: Global Aerospace Logistics LLC</p>
          <div style={{ padding: "12px", background: "var(--color-bg-subtle)", borderRadius: "var(--radius-sm)" }}>
            Total Amount Due: $1,280,000.00 (Net 30)
          </div>
        </PrintLayout>
      </div>
    </div>
  ),
};

export const DensityGallery: Story = {
  name: "Density scale comparison",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", padding: "var(--space-2)" }}>
            Density: {density}
          </div>
          <PrintLayout density={density}>
            <div style={{ fontWeight: 600 }}>Print Document ({density})</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              Invoice lines rendered in {density} spacing format.
            </div>
          </PrintLayout>
        </div>
      ))}
    </div>
  ),
};

export const Default: Story = {
  ...AnatomyAndComposition,
};
