import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./donut-chart";

const meta: Meta<typeof DonutChart> = {
  title: "Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling mode",
    },
    centerValue: {
      control: "text",
      description: "Central highlighted metric or percentage",
    },
    centerLabel: {
      control: "text",
      description: "Descriptive label beneath center value",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DonutChart>;

export const Default: Story = {
  args: {
    centerValue: "100%",
    centerLabel: "Total",
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-8)", alignItems: "center" }}>
      {(["ultra-compact", "compact", "standard", "comfortable"] as const).map((density) => (
        <div key={density} style={{ textAlign: "center" }}>
          <h5 style={{ marginBlockEnd: "var(--space-2)", textTransform: "capitalize" }}>
            {density}
          </h5>
          <DonutChart
            density={density}
            centerValue="75%"
            centerLabel={density}
          />
        </div>
      ))}
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "center" }}>
      <h4>Donut Chart Anatomy</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", margin: 0 }}>
        Multi-segment proportion visualizer with centralized metric callout and responsive density sizing.
      </p>
      <DonutChart
        segments={[
          { label: "Hardware", value: 45, color: "var(--chart-1)" },
          { label: "Software", value: 35, color: "var(--chart-2)" },
          { label: "Services", value: 20, color: "var(--chart-3)" },
        ]}
        centerValue="$2.4M"
        centerLabel="Revenue"
      />
    </div>
  ),
};
