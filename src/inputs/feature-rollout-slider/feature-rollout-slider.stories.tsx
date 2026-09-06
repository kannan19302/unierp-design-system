import type { Meta, StoryObj } from "@storybook/react";
import { FeatureRolloutSlider } from "./feature-rollout-slider";

const meta: Meta<typeof FeatureRolloutSlider> = {
  title: "Inputs/FeatureRolloutSlider",
  component: FeatureRolloutSlider,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeatureRolloutSlider>;

export const Default: Story = {
  args: {
    flagKey: "finance_realtime_ledger_stream",
    description: "Enables sub-second distributed Kafka event sync for high-volume transactions",
    value: 25,
    totalAudience: 12500,
    audienceUnit: "tenants",
    isKillswitchActive: false,
  },
};

export const GeneralAvailability: Story = {
  args: {
    flagKey: "strata_unified_command_k",
    description: "Global keyboard shortcut indexing across 15 enterprise verticals",
    value: 100,
    totalAudience: 85000,
    audienceUnit: "active seats",
  },
};

export const EmergencyKillswitchEngaged: Story = {
  args: {
    flagKey: "experimental_ai_tax_reconciler",
    description: "Autonomous journal entry tax reconciler with OpenAI function calls",
    value: 50,
    totalAudience: 4000,
    audienceUnit: "business entities",
    isKillswitchActive: true,
  },
};
