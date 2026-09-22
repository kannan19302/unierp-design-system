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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <CapTableScenarioSimulator
        roundName="Anatomy Composition - Early Growth"
        initialPreMoney={20000000}
        initialInvestment={5000000}
        initialOptionPoolExpansionPercent={12}
        currency="USD"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Series A Default (Compact)</h4>
        <CapTableScenarioSimulator
          roundName="Series A Simulation"
          initialPreMoney={40000000}
          initialInvestment={10000000}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Growth Equity (Comfortable)</h4>
        <CapTableScenarioSimulator
          roundName="Series C Mega Round"
          initialPreMoney={80000000}
          initialInvestment={25000000}
          initialOptionPoolExpansionPercent={8}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
