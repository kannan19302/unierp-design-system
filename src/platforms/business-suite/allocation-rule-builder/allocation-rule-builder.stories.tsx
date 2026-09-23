import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AllocationRuleBuilder } from "./allocation-rule-builder";

const meta: Meta<typeof AllocationRuleBuilder> = {
  title: "Platforms/BusinessSuite/AllocationRuleBuilder",
  component: AllocationRuleBuilder,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AllocationRuleBuilder>;

export const DefaultPercentageBalanced: Story = {
  args: {
    poolName: "FY27 Corporate IT & Datacenter Overhead Pool",
    poolAmount: 2500000,
    currency: "USD",
    basisType: "percentage",
  },
};

export const FixedCurrencyUnbalanced: Story = {
  args: {
    poolName: "Executive Travel & Global Real Estate Pool",
    poolAmount: 750000,
    currency: "EUR",
    basisType: "fixed_amount",
    initialTargets: [
      { id: "t1", entityName: "Berlin Technology Campus", costCenterCode: "CC-8010", basisValue: 300000 },
      { id: "t2", entityName: "London Regional Headquarters", costCenterCode: "CC-8020", basisValue: 250000 },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Balanced Pool Rule</p>
        <AllocationRuleBuilder
          poolName="Corporate Overhead Pool"
          poolAmount={1500000}
          basisType="percentage"
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Fixed Currency Apportionment</p>
        <AllocationRuleBuilder
          poolName="Facilities Operations"
          poolAmount={500000}
          basisType="fixed_amount"
          currency="EUR"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <AllocationRuleBuilder poolName="Pool Standard" poolAmount={1000000} density="compact" />
      <AllocationRuleBuilder poolName="Pool Comfortable" poolAmount={1000000} density="comfortable" />
    </div>
  ),
};
