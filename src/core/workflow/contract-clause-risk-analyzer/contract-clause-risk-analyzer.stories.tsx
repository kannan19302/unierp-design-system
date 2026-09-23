import type { Meta, StoryObj } from "@storybook/react";
import { ContractClauseRiskAnalyzer } from "./contract-clause-risk-analyzer";

const meta: Meta<typeof ContractClauseRiskAnalyzer> = {
  title: "Core/Workflow/ContractClauseRiskAnalyzer",
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Contract Redline Risk Analysis Workbench</h4>
        <ContractClauseRiskAnalyzer density="compact" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Standard Density</h4>
        <ContractClauseRiskAnalyzer density="standard" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Ultra-Compact Density</h4>
        <ContractClauseRiskAnalyzer density="ultra-compact" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Comfortable Density</h4>
        <ContractClauseRiskAnalyzer density="comfortable" />
      </div>
    </div>
  ),
};
