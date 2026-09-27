import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CandlestickChart } from "./candlestick-chart";

const SAMPLE_PRICES = [
  { date: "2024-01-01", open: 150, high: 155, low: 148, close: 154 },
  { date: "2024-01-02", open: 154, high: 158, low: 152, close: 151 },
  { date: "2024-01-03", open: 151, high: 160, low: 150, close: 159 },
  { date: "2024-01-04", open: 159, high: 162, low: 156, close: 157 },
  { date: "2024-01-05", open: 157, high: 165, low: 155, close: 163 },
  { date: "2024-01-06", open: 163, high: 164, low: 158, close: 160 },
];

const meta: Meta<typeof CandlestickChart> = {
  title: "Charts/CandlestickChart",
  component: CandlestickChart,
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
    bullColor: {
      control: "color",
    },
    bearColor: {
      control: "color",
    },
  },
};

export default meta;
type Story = StoryObj<typeof CandlestickChart>;

export const Default: Story = {
  render: (args) => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <CandlestickChart {...args} data={SAMPLE_PRICES} />
    </div>
  ),
  args: {
    density: "standard",
    height: 280,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "540px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <CandlestickChart data={SAMPLE_PRICES} />
    </div>
  ),
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "540px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density (24px target)
        </h4>
        <CandlestickChart data={SAMPLE_PRICES.slice(0, 4)} height={160} density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compact Density (28px target)
        </h4>
        <CandlestickChart data={SAMPLE_PRICES.slice(0, 4)} height={180} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Standard Density (32px target)
        </h4>
        <CandlestickChart data={SAMPLE_PRICES} height={220} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Comfortable Density (40px target)
        </h4>
        <CandlestickChart data={SAMPLE_PRICES} height={280} density="comfortable" />
      </div>
    </div>
  ),
};
