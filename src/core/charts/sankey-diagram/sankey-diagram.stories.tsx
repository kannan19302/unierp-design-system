import type { Meta, StoryObj } from "@storybook/react";
import { SankeyDiagram } from "./sankey-diagram";

const SAMPLE_NODES = [
  { id: "organic", label: "Organic Search", color: "var(--color-brand)" },
  { id: "paid", label: "Paid Ads", color: "var(--color-warning)" },
  { id: "referral", label: "Referrals", color: "var(--color-info)" },
  { id: "landing", label: "Landing Page", color: "var(--color-success)" },
  { id: "checkout", label: "Checkout", color: "var(--color-brand)" },
];

const SAMPLE_LINKS = [
  { source: "organic", target: "landing", value: 500 },
  { source: "paid", target: "landing", value: 300 },
  { source: "referral", target: "landing", value: 200 },
  { source: "landing", target: "checkout", value: 650 },
];

const meta: Meta<typeof SankeyDiagram> = {
  title: "Core/Charts/SankeyDiagram",
  component: SankeyDiagram,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof SankeyDiagram>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", padding: "var(--space-4)" }}>
      <SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} height={260} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Marketing Attribution Flow
        </h4>
        <SankeyDiagram nodes={SAMPLE_NODES} links={SAMPLE_LINKS} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Pipeline
        </h4>
        <SankeyDiagram
          nodes={SAMPLE_NODES.slice(0, 4)}
          links={SAMPLE_LINKS.slice(0, 2)}
          height={200}
        />
      </div>
    </div>
  ),
};
