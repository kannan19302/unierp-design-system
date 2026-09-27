import React from "react";
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
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
    height: {
      control: "number",
    },
    positiveColor: {
      control: "color",
    },
    negativeColor: {
      control: "color",
    },
    totalColor: {
      control: "color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof WaterfallChart>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: "550px", padding: "var(--space-4)" }}>
      <WaterfallChart {...args} data={SAMPLE_DATA} />
    </div>
  ),
  args: {
    density: "standard",
    height: 280,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <WaterfallChart data={SAMPLE_DATA} height={300} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "600px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density (24px target)
        </h4>
        <WaterfallChart data={SAMPLE_DATA.slice(0, 4)} height={180} density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Density (28px target)
        </h4>
        <WaterfallChart data={SAMPLE_DATA.slice(0, 4)} height={200} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Density (32px target)
        </h4>
        <WaterfallChart data={SAMPLE_DATA} height={240} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Comfortable Density (40px target)
        </h4>
        <WaterfallChart data={SAMPLE_DATA} height={280} density="comfortable" />
      </div>
    </div>
  ),
};
