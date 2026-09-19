import type { Meta, StoryObj } from "@storybook/react";
import { StackedBarChart } from "./stacked-bar-chart";

const SAMPLE_CATEGORIES = ["Q1", "Q2", "Q3", "Q4"];
const SAMPLE_SERIES = [
  { label: "Hardware", values: [40, 55, 60, 70], color: "var(--color-brand)" },
  { label: "Software", values: [30, 35, 45, 50], color: "var(--color-success)" },
  { label: "Services", values: [20, 25, 30, 35], color: "var(--color-warning)" },
];

const meta: Meta<typeof StackedBarChart> = {
  title: "Charts/StackedBarChart",
  component: StackedBarChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof StackedBarChart>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "500px", padding: "var(--space-4)" }}>
      <StackedBarChart categories={SAMPLE_CATEGORIES} series={SAMPLE_SERIES} />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <StackedBarChart
        categories={SAMPLE_CATEGORIES}
        series={SAMPLE_SERIES}
        height={300}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "550px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Vertical Stacked Columns
        </h4>
        <StackedBarChart categories={SAMPLE_CATEGORIES} series={SAMPLE_SERIES} orientation="vertical" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Horizontal Stacked Bars
        </h4>
        <StackedBarChart categories={SAMPLE_CATEGORIES} series={SAMPLE_SERIES} orientation="horizontal" height={220} />
      </div>
    </div>
  ),
};
