import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AlertRuleConditionBuilder } from "./alert-rule-condition-builder";

const meta: Meta<typeof AlertRuleConditionBuilder> = {
  title: "Workflow/AlertRuleConditionBuilder",
  component: AlertRuleConditionBuilder,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AlertRuleConditionBuilder>;

const sampleRuleP1 = {
  ruleId: "rule_p1_5xx",
  ruleName: "Production Edge 5xx Gateway Failure Spike",
  metricKey: "nginx_http_requests_5xx_rate",
  operator: ">=" as const,
  threshold: 15,
  evaluationWindow: "5m" as const,
  severity: "P1_CRITICAL" as const,
  channels: ["SLACK_OPS", "PAGERDUTY_TIER1"],
  suppressionEnabled: false,
};

const sampleRuleP2 = {
  ruleId: "rule_db_conn",
  ruleName: "PostgreSQL Pool Saturation",
  metricKey: "pg_stat_activity_connections",
  operator: ">" as const,
  threshold: 85,
  evaluationWindow: "1m" as const,
  severity: "P2_MAJOR" as const,
  channels: ["SLACK_OPS"],
  suppressionEnabled: true,
};

export const Default: Story = {
  args: {
    initialRule: sampleRuleP1,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    initialRule: sampleRuleP2,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    initialRule: sampleRuleP1,
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Critical Alert Condition Policy</p>
        <AlertRuleConditionBuilder
          initialRule={sampleRuleP1}
          onSaveRule={(r) => console.log("Saved:", r)}
          onTestTrigger={(r) => console.log("Simulate:", r)}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Major Database Saturation Alert</p>
        <AlertRuleConditionBuilder
          initialRule={sampleRuleP2}
          density="standard"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <AlertRuleConditionBuilder initialRule={sampleRuleP1} density="ultra-compact" />
      <AlertRuleConditionBuilder initialRule={sampleRuleP1} density="compact" />
      <AlertRuleConditionBuilder initialRule={sampleRuleP1} density="standard" />
      <AlertRuleConditionBuilder initialRule={sampleRuleP1} density="comfortable" />
    </div>
  ),
};
