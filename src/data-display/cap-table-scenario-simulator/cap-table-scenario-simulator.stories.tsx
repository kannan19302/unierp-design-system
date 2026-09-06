import type { Meta, StoryObj } from "@storybook/react";
import { CapTableScenarioSimulator } from "./cap-table-scenario-simulator";

const meta: Meta<typeof CapTableScenarioSimulator> = {
  title: "DataDisplay/CapTableScenarioSimulator",
  component: CapTableScenarioSimulator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CapTableScenarioSimulator>;

export const DefaultSeriesA: Story = {
  args: {
    roundName: "Series A Financing Round Simulation",
    initialPreMoney: 35000000,
    initialInvestment: 10000000,
    initialOptionPoolExpansionPercent: 10,
    currency: "USD",
  },
};

export const SeedExtension: Story = {
  args: {
    roundName: "Seed Extension Convertible Round",
    initialPreMoney: 12000000,
    initialInvestment: 3000000,
    initialOptionPoolExpansionPercent: 5,
    currency: "USD",
  },
};
