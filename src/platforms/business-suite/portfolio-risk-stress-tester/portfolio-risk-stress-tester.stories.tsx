import type { Meta, StoryObj } from "@storybook/react";
import { PortfolioRiskStressTester } from "./portfolio-risk-stress-tester";

const meta: Meta<typeof PortfolioRiskStressTester> = {
  title: "Platforms/BusinessSuite/PortfolioRiskStressTester",
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

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>2008 GFC Lehman Shock (Compact)</h4>
        <PortfolioRiskStressTester
          initialScenarioId="gfc_2008"
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Rates Shock +300bps (Ultra-Compact)</h4>
        <PortfolioRiskStressTester
          initialScenarioId="rate_shock_300"
          density="ultra-compact"
        />
      </div>
    </div>
  ),
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
