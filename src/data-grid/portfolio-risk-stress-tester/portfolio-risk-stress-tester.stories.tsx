import type { Meta, StoryObj } from "@storybook/react";
import { PortfolioRiskStressTester } from "./portfolio-risk-stress-tester";

const meta: Meta<typeof PortfolioRiskStressTester> = {
  title: "Data Grid/PortfolioRiskStressTester",
  component: PortfolioRiskStressTester,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PortfolioRiskStressTester>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const RateShockScenario: Story = {
  args: {
    initialScenarioId: "rate_shock_300",
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    density: "comfortable",
  },
};
