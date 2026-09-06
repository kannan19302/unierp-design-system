import type { Meta, StoryObj } from "@storybook/react";
import { AlertRuleConditionBuilder } from "./alert-rule-condition-builder";

const meta: Meta<typeof AlertRuleConditionBuilder> = {
  title: "Workflow/AlertRuleConditionBuilder",
  component: AlertRuleConditionBuilder,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AlertRuleConditionBuilder>;

export const Default: Story = {
  args: {
    initialRule: {
      ruleId: "rule_p1_5xx",
      ruleName: "Production Edge 5xx Gateway Failure Spike",
      metricKey: "nginx_http_requests_5xx_rate",
      operator: ">=",
      threshold: 15,
      evaluationWindow: "5m",
      severity: "P1_CRITICAL",
      channels: ["SLACK_OPS", "PAGERDUTY_TIER1"],
      suppressionEnabled: false,
    },
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    initialRule: {
      ruleId: "rule_db_conn",
      ruleName: "PostgreSQL Pool Saturation",
      metricKey: "pg_stat_activity_connections",
      operator: ">",
      threshold: 85,
      evaluationWindow: "1m",
      severity: "P2_MAJOR",
      channels: ["SLACK_OPS"],
      suppressionEnabled: true,
    },
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    initialRule: {
      ruleId: "rule_p3_mem",
      ruleName: "Kubernetes Node Memory Warning",
      metricKey: "container_memory_working_set_bytes_ratio",
      operator: ">=",
      threshold: 0.85,
      evaluationWindow: "15m",
      severity: "P3_WARNING",
      channels: ["EMAIL_INFRA"],
      suppressionEnabled: false,
    },
    density: "comfortable",
  },
};
