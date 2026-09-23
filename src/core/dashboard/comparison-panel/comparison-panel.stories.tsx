import type { Meta, StoryObj } from "@storybook/react";
import { ComparisonPanel } from "./comparison-panel";

const sampleItems = [
  { label: "Gross Revenue", current: "$1.24M", previous: "$980K", change: 26.5 },
  { label: "Completed Orders", current: "3,241", previous: "2,890", change: 12.1 },
  { label: "Average Order Value", current: "$382.60", previous: "$339.10", change: 12.8 },
  { label: "Customer Acquisition Cost", current: "$42.50", previous: "$48.00", change: -11.5 },
  { label: "Refund / Return Rate", current: "1.8%", previous: "2.4%", change: -25.0 },
];

const meta: Meta<typeof ComparisonPanel> = {
  title: "Core/Dashboard/ComparisonPanel",
  component: ComparisonPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof ComparisonPanel>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 620, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <ComparisonPanel items={sampleItems} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 620, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ComparisonPanel
        title="Q1 vs Q4 Performance"
        items={[
          { label: "Active Enterprise Subscriptions", current: "412", previous: "385", change: 7.0 },
          { label: "Net Retention Rate (NDR)", current: "118%", previous: "114%", change: 3.5 },
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 620, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Standard Fiscal Benchmark
        </h4>
        <ComparisonPanel items={sampleItems} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Negative Variance Benchmark
        </h4>
        <ComparisonPanel
          title="Cloud Infrastructure Costs"
          items={[
            { label: "Compute Spend", current: "$84,200", previous: "$62,000", change: 35.8 },
            { label: "Storage Volumes", current: "$18,500", previous: "$15,200", change: 21.7 },
          ]}
        />
      </div>
    </div>
  ),
};
