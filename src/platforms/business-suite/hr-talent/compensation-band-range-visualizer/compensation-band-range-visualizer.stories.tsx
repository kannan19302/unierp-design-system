import type { Meta, StoryObj } from "@storybook/react";
import { CompensationBandRangeVisualizer } from "./compensation-band-range-visualizer";

const meta: Meta<typeof CompensationBandRangeVisualizer> = {
  title: "Platforms/BusinessSuite/Talent/CompensationBandRangeVisualizer",
  component: CompensationBandRangeVisualizer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CompensationBandRangeVisualizer>;

export const Default: Story = {
  args: {
    currentOfferOrSalary: 265000,
    density: "compact",
  },
};

export const HighCompaRatio: Story = {
  args: {
    currentOfferOrSalary: 305000,
    density: "compact",
  },
};

export const LowCompaRatio: Story = {
  args: {
    currentOfferOrSalary: 215000,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
    currentOfferOrSalary: 250000,
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Standard Density (Healthy Compa-Ratio)</h4>
        <CompensationBandRangeVisualizer currentOfferOrSalary={265000} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Compact Density (High Compa-Ratio)</h4>
        <CompensationBandRangeVisualizer currentOfferOrSalary={305000} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Ultra Compact (Low Compa-Ratio)</h4>
        <CompensationBandRangeVisualizer currentOfferOrSalary={215000} density="ultra-compact" />
      </div>
    </div>
  ),
};
