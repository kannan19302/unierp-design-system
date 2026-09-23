import type { Meta, StoryObj } from "@storybook/react";
import { FilterRuleBuilder } from "./filter-rule-builder";

const meta: Meta<typeof FilterRuleBuilder> = {
  title: "Core/Inputs/FilterRuleBuilder",
  component: FilterRuleBuilder,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterRuleBuilder>;

export const Default: Story = {
  args: {
    rules: [
      { id: "1", field: "status", operator: "equals", value: "active" },
      { id: "2", field: "amount", operator: "greater_than", value: "5000" },
    ],
  },
};
