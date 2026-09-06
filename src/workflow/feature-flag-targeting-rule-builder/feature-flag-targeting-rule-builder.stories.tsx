import type { Meta, StoryObj } from "@storybook/react";
import { FeatureFlagTargetingRuleBuilder } from "./feature-flag-targeting-rule-builder";

const meta: Meta<typeof FeatureFlagTargetingRuleBuilder> = {
  title: "Workflow/FeatureFlagTargetingRuleBuilder",
  component: FeatureFlagTargetingRuleBuilder,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeatureFlagTargetingRuleBuilder>;

const sampleVariations = [
  { id: "var-true", name: "Enabled (True)", value: true },
  { id: "var-false", name: "Disabled (False)", value: false },
];

const sampleRules = [
  {
    id: "rule-enterprise",
    name: "Enterprise Early Access Tier",
    clauses: [
      {
        id: "c-1",
        attribute: "subscription_tier",
        operator: "is_one_of" as const,
        values: ["ENTERPRISE", "STRATEGIC"],
      },
      {
        id: "c-2",
        attribute: "country",
        operator: "is_one_of" as const,
        values: ["US", "CA", "GB"],
      },
    ],
    serveVariationId: "var-true",
  },
  {
    id: "rule-beta-tenants",
    name: "Beta Pilot Tenants",
    clauses: [
      {
        id: "c-3",
        attribute: "tenant_id",
        operator: "is_one_of" as const,
        values: ["tenant-acme-corp", "tenant-meridian-health"],
      },
    ],
    serveVariationId: "var-true",
  },
];

export const Default: Story = {
  args: {
    flagKey: "release-v2-finance-settlement",
    flagName: "V2 High-Throughput Settlement Engine",
    enabled: true,
    variations: sampleVariations,
    rules: sampleRules,
    defaultOffVariationId: "var-false",
    density: "compact",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    enabled: false,
  },
};
