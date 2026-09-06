import type { Meta, StoryObj } from "@storybook/react";
import {
  BankRuleConditionBuilder,
  BankRule,
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
  title: "Workflow/BankRuleConditionBuilder",
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
