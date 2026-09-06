import type { Meta, StoryObj } from "@storybook/react";
import { CompensationBandRangeVisualizer } from "./compensation-band-range-visualizer";

const meta: Meta<typeof CompensationBandRangeVisualizer> = {
  title: "Data Display/CompensationBandRangeVisualizer",
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
