import type { Meta, StoryObj } from "@storybook/react";
import { PrintLayout } from "./print-layout";

const meta: Meta<typeof PrintLayout> = {
  title: "Layout/PrintLayout",
  component: PrintLayout,
  tags: ["autodocs"],
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
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
        <h2 style={{ margin: "0 0 12px 0" }}>Formal General Ledger Statement</h2>
        <p style={{ margin: "0 0 8px 0", color: "var(--color-text-secondary)" }}>
          Period ending August 31, 2026. Certified by external auditor.
        </p>
        <table style={{ inlineSize: "100%", borderCollapse: "collapse", marginBlockStart: "16px" }}>
          <thead>
            <tr style={{ borderBlockEnd: "2px solid var(--color-border-default)" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Account Code</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Description</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Debit</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Credit</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBlockEnd: "1px solid var(--color-border-default)" }}>
              <td style={{ padding: "8px" }}>1000-CASH</td>
              <td style={{ padding: "8px" }}>Operating Cash Reserve</td>
              <td style={{ textAlign: "right", padding: "8px" }}>$450,000.00</td>
              <td style={{ textAlign: "right", padding: "8px" }}>—</td>
            </tr>
            <tr style={{ borderBlockEnd: "1px solid var(--color-border-default)" }}>
              <td style={{ padding: "8px" }}>2000-AP</td>
              <td style={{ padding: "8px" }}>Accounts Payable Trade</td>
              <td style={{ textAlign: "right", padding: "8px" }}>—</td>
              <td style={{ textAlign: "right", padding: "8px" }}>$450,000.00</td>
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
        <h4 style={{ margin: "0 0 8px 0", color: "var(--color-text-primary)" }}>Standard Invoice Print Layout</h4>
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

export const Default: Story = {
  ...AnatomyAndComposition,
};

