import type { Meta, StoryObj } from "@storybook/react";
import { WaterfallChart } from "./waterfall-chart";

const SAMPLE_DATA = [
  { label: "Starting Cash", value: 100000, isTotal: true },
  { label: "Revenue", value: 45000 },
  { label: "Payroll", value: -28000 },
  { label: "Infrastructure", value: -12000 },
  { label: "Marketing", value: -8000 },
  { label: "Tax Refund", value: 5000 },
  { label: "Ending Cash", value: 102000, isTotal: true },
];

const meta: Meta<typeof WaterfallChart> = {
  title: "Charts/WaterfallChart",
  component: WaterfallChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof WaterfallChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", padding: "var(--space-4)" }}>
      <WaterfallChart data={SAMPLE_DATA} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <WaterfallChart data={SAMPLE_DATA} height={300} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Cash Flow Statement
        </h4>
        <WaterfallChart data={SAMPLE_DATA} />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Net Variance
        </h4>
        <WaterfallChart data={SAMPLE_DATA.slice(0, 4)} height={200} />
      </div>
    </div>
  ),
};
