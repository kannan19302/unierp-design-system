import type { Meta, StoryObj } from "@storybook/react";
import {
  BankRuleConditionBuilder,
  type BankRule,
} from "./bank-rule-condition-builder";

const mockRule: Partial<BankRule> = {
  id: "rule-aws-01",
  name: "AWS Cloud Services Auto-Allocation",
  priority: 1,
  matchType: "all",
  targetAccount: "SVB Operating Checking (*9941)",
  conditions: [
    { id: "c-1", field: "description", operator: "contains", value: "Amazon Web Services" },
    { id: "c-2", field: "amount", operator: "greater_than", value: "250.00" },
  ],
  actionType: "spend_money",
  payee: "Amazon Web Services Inc",
  glAccount: "6120",
  taxCode: "STANDARD-INPUT-20%",
  autoReconcile: true,
};

const meta: Meta<typeof BankRuleConditionBuilder> = {
  title: "Platforms/BusinessSuite/Finance/BankRuleConditionBuilder",
  component: BankRuleConditionBuilder,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BankRuleConditionBuilder>;

export const Default: Story = {
  args: {
    initialRule: mockRule,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    initialRule: mockRule,
    density: "standard",
  },
  render: (args) => (
    <div style={{ inlineSize: "100%", maxInlineSize: "960px" }}>
      <BankRuleConditionBuilder {...args} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Compact Density</h4>
        <BankRuleConditionBuilder initialRule={mockRule} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable Density</h4>
        <BankRuleConditionBuilder initialRule={mockRule} density="comfortable" />
      </div>
    </div>
  ),
};
