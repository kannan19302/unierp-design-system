import type { Meta, StoryObj } from "@storybook/react";
import { FactBox, FactBoxTile, FactBoxField, FactBoxMetric } from "./fact-box";
import { Badge } from "../../primitives/badge";

const meta: Meta<typeof FactBox> = {
  title: "Core/Layout/FactBox",
  component: FactBox,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof FactBox>;

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", blockSize: "600px", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: "var(--space-4)", backgroundColor: "var(--color-bg-surface)" }}>
        <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", margin: "0 0 var(--space-2) 0" }}>
          Sales Order — SO-2026-0894
        </h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          Active order entry workspace. The FactBox on the right provides live customer credit and telemetry.
        </p>
      </div>

      <FactBox {...args}>
        <FactBoxTile id="cust-kpis" title="Customer Overview" badge={<Badge variant="success">VIP TIER 1</Badge>}>
          <FactBoxMetric
            label="Total Outstanding Balance"
            value="$148,250.00"
            trend="up"
            trendValue="4.2%"
            subtext="Available credit: $51,750.00"
          />
        </FactBoxTile>

        <FactBoxTile id="cust-credit" title="Credit & Terms">
          <FactBoxField label="Credit Limit" value="$200,000.00" mono />
          <FactBoxField label="Payment Terms" value="Net 30 Days" />
          <FactBoxField label="Past Due Amount" value="$0.00" mono highlight />
          <FactBoxField label="Days Sales Outstanding" value="22 Days" mono />
        </FactBoxTile>

        <FactBoxTile id="cust-contact" title="Primary Contact">
          <FactBoxField label="Contact Person" value="Eleanor Vance" />
          <FactBoxField label="Direct Phone" value="+1 (555) 389-1029" mono />
          <FactBoxField label="Billing Email" value="ar@apexlogistics.com" />
          <FactBoxField label="Tax Identification" value="US-EIN 84-2910481" mono />
        </FactBoxTile>

        <FactBoxTile id="cust-stats" title="Historical Velocity">
          <FactBoxField label="YTD Orders Placed" value="48" mono />
          <FactBoxField label="Average Order Value" value="$12,450.00" mono />
          <FactBoxField label="On-Time Payment Rate" value="99.4%" mono />
        </FactBoxTile>
      </FactBox>
    </div>
  ),
  args: {
    title: "Customer Intelligence",
    collapsible: true,
    defaultCollapsed: false,
    density: "compact",
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Expanded Compact Density</h4>
        <div style={{ display: "flex", blockSize: "380px", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
          <div style={{ flex: 1, padding: "16px" }}>Workspace Primary Area</div>
          <FactBox title="Vendor FactBox" collapsible={true} defaultCollapsed={false} density="compact">
            <FactBoxTile id="vendor-rating" title="Vendor Scorecard" badge={<Badge variant="primary">PREFERRED</Badge>}>
              <FactBoxMetric
                label="On-Time Delivery Rate"
                value="98.6%"
                trend="up"
                trendValue="1.2%"
                subtext="Target benchmark: >= 95%"
              />
            </FactBoxTile>
            <FactBoxTile id="vendor-pos" title="Open Commitments">
              <FactBoxField label="Open Purchase Orders" value="6 Active POs" />
              <FactBoxField label="Unbilled Commitment" value="$84,200.00" mono />
            </FactBoxTile>
          </FactBox>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Ultra-Compact Density</h4>
        <div style={{ display: "flex", blockSize: "300px", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
          <div style={{ flex: 1, padding: "16px" }}>Workspace Primary Area</div>
          <FactBox title="Account Summary" collapsible={true} density="ultra-compact">
            <FactBoxTile id="compact-tile" title="Ledger Balances">
              <FactBoxField label="Account ID" value="1010-CASH" mono />
              <FactBoxField label="Posting Currency" value="USD ($)" />
              <FactBoxField label="Debit Turnover" value="$920,400.00" mono />
              <FactBoxField label="Credit Turnover" value="$780,100.00" mono />
            </FactBoxTile>
          </FactBox>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Collapsed Strip State</h4>
        <div style={{ display: "flex", blockSize: "260px", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-md)" }}>
          <div style={{ flex: 1, padding: "16px" }}>Workspace Primary Area</div>
          <FactBox title="Telemetry" collapsible={true} defaultCollapsed={true} density="compact">
            <FactBoxTile id="hidden-tile" title="Hidden">
              <FactBoxField label="Field" value="Value" />
            </FactBoxTile>
          </FactBox>
        </div>
      </div>
    </div>
  ),
};

export const Customer360: Story = {
  ...AnatomyAndComposition,
};

