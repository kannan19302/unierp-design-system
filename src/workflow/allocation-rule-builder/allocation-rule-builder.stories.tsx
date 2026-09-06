import type { Meta, StoryObj } from "@storybook/react";
import { AllocationRuleBuilder } from "./allocation-rule-builder";

const meta: Meta<typeof AllocationRuleBuilder> = {
  title: "Workflow/AllocationRuleBuilder",
  component: AllocationRuleBuilder,
  parameters: {
    layout: "padded",
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
