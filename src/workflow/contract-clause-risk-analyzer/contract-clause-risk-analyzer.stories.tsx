import type { Meta, StoryObj } from "@storybook/react";
import { ContractClauseRiskAnalyzer } from "./contract-clause-risk-analyzer";

const meta: Meta<typeof ContractClauseRiskAnalyzer> = {
  title: "Workflow/ContractClauseRiskAnalyzer",
  component: ContractClauseRiskAnalyzer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContractClauseRiskAnalyzer>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
    contractTitle: "Strategic Cloud Hosting Agreement (Tier-1 SLA)",
  },
};

export const Comfortable: Story = {
  args: {
    density: "comfortable",
  },
};
