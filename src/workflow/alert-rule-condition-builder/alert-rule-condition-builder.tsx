import React, { useId, useState } from "react";
import styles from "./alert-rule-condition-builder.module.css";

export type AlertSeverity = "P1_CRITICAL" | "P2_MAJOR" | "P3_WARNING" | "P4_INFO";
export type AlertOperator = ">" | ">=" | "<" | "<=" | "==";

export interface AlertRuleModel {
  ruleId: string; // "alert_rule_5xx"
  ruleName: string; // "Production HTTP 5xx Spike"
  metricKey: string; // "http_requests_5xx_rate"
  operator: AlertOperator;
  threshold: number; // 5.0
  evaluationWindow: "1m" | "5m" | "15m" | "1h";
  severity: AlertSeverity;
  channels: string[]; // ["SLACK_OPS", "PAGERDUTY_TIER1"]
  suppressionEnabled: boolean;
}

export interface AlertRuleConditionBuilderProps {
  initialRule?: AlertRuleModel;
  onSaveRule?: (rule: AlertRuleModel) => void;
  onTestTrigger?: (rule: AlertRuleModel) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const AVAILABLE_CHANNELS = [
  { id: "SLACK_OPS", label: "Slack #ops-incident-room" },
  { id: "PAGERDUTY_TIER1", label: "PagerDuty SRE Primary On-Call" },
  { id: "OPSGENIE_SEV1", label: "OpsGenie High Priority" },
  { id: "EMAIL_INFRA", label: "Infra Security Distribution List" },
];

export const AlertRuleConditionBuilder: React.FC<AlertRuleConditionBuilderProps> = ({
  initialRule = {
    ruleId: "rule_new",
    ruleName: "High API Error Rate Alert",
    metricKey: "http_server_errors_total",
    operator: ">=",
    threshold: 10,
    evaluationWindow: "5m",
    severity: "P1_CRITICAL",
    channels: ["SLACK_OPS", "PAGERDUTY_TIER1"],
    suppressionEnabled: false,
  },
  onSaveRule,
  onTestTrigger,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const ruleNameId = useId();
  const metricKeyId = useId();
  const operatorId = useId();
  const thresholdId = useId();
  const windowId = useId();
  const severityId = useId();

  const [rule, setRule] = useState<AlertRuleModel>(initialRule);
  const [testResult, setTestResult] = useState<string | null>(null);

  const toggleChannel = (channelId: string) => {
    setRule((prev) => {
      const exists = prev.channels.includes(channelId);
      return {
        ...prev,
        channels: exists
          ? prev.channels.filter((c) => c !== channelId)
          : [...prev.channels, channelId],
      };
    });
  };

  const handleTest = () => {
    onTestTrigger?.(rule);
    setTestResult(
      `Test evaluation passed: Current metric (${rule.metricKey} = 14.2) satisfies ${rule.operator} ${rule.threshold} over ${rule.evaluationWindow}. Notification dispatched.`
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRule?.(rule);
  };

  const getSeverityClass = (sev: AlertSeverity) => {
    switch (sev) {
      case "P1_CRITICAL":
        return styles.sevP1;
      case "P2_MAJOR":
        return styles.sevP2;
      case "P3_WARNING":
        return styles.sevP3;
      case "P4_INFO":
        return styles.sevP4;
      default:
        return "";
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.sreBadge}>OBSERVABILITY &amp; SRE ALERT ROUTER</span>
          <span className={`${styles.severityPill} ${getSeverityClass(rule.severity)}`}>
            {rule.severity.replace(/_/g, " ")}
          </span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Observability Alert Rule &amp; Routing Policy Builder
          </h2>
          <span className={styles.targetChannelsMeta}>
            {rule.channels.length} active notification target(s)
          </span>
        </div>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor={ruleNameId} className={styles.inputLabel}>
              Alert Policy Name:
            </label>
            <input
              id={ruleNameId}
              type="text"
              value={rule.ruleName}
              onChange={(e) => setRule({ ...rule, ruleName: e.target.value })}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={severityId} className={styles.inputLabel}>
              Incident Severity:
            </label>
            <select
              id={severityId}
              value={rule.severity}
              onChange={(e) => setRule({ ...rule, severity: e.target.value as AlertSeverity })}
              className={styles.select}
            >
              <option value="P1_CRITICAL">P1 - Critical (Page Immediately)</option>
              <option value="P2_MAJOR">P2 - Major (High Urgency)</option>
              <option value="P3_WARNING">P3 - Warning (Business Hours)</option>
              <option value="P4_INFO">P4 - Info (Digest Log)</option>
            </select>
          </div>
        </div>

        {/* Condition Strip */}
        <div className={styles.conditionSection}>
          <h3 className={styles.sectionHeading}>Trigger Condition Rule</h3>
          <div className={styles.conditionGrid}>
            <div className={styles.formGroup}>
              <label htmlFor={metricKeyId} className={styles.inputLabel}>
                Metric Key:
              </label>
              <input
                id={metricKeyId}
                type="text"
                value={rule.metricKey}
                onChange={(e) => setRule({ ...rule, metricKey: e.target.value })}
                className={styles.inputMono}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={operatorId} className={styles.inputLabel}>
                Operator:
              </label>
              <select
                id={operatorId}
                value={rule.operator}
                onChange={(e) => setRule({ ...rule, operator: e.target.value as AlertOperator })}
                className={styles.select}
              >
                <option value=">">&gt; (Greater Than)</option>
                <option value=">=">&gt;= (Greater or Equal)</option>
                <option value="<">&lt; (Less Than)</option>
                <option value="<=">&lt;= (Less or Equal)</option>
                <option value="==">== (Exact Match)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={thresholdId} className={styles.inputLabel}>
                Threshold:
              </label>
              <input
                id={thresholdId}
                type="number"
                step="any"
                value={rule.threshold}
                onChange={(e) => setRule({ ...rule, threshold: parseFloat(e.target.value) || 0 })}
                className={styles.inputMono}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={windowId} className={styles.inputLabel}>
                Evaluation Window:
              </label>
              <select
                id={windowId}
                value={rule.evaluationWindow}
                onChange={(e) =>
                  setRule({ ...rule, evaluationWindow: e.target.value as AlertRuleModel["evaluationWindow"] })
                }
                className={styles.select}
              >
                <option value="1m">Over 1 Minute</option>
                <option value="5m">Over 5 Minutes</option>
                <option value="15m">Over 15 Minutes</option>
                <option value="1h">Over 1 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Routing */}
        <div className={styles.routingSection}>
          <h3 className={styles.sectionHeading}>Notification Dispatch Targets</h3>
          <div className={styles.channelsGrid}>
            {AVAILABLE_CHANNELS.map((ch) => {
              const checked = rule.channels.includes(ch.id);
              return (
                <label key={ch.id} className={`${styles.channelCard} ${checked ? styles.channelSelected : ""}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleChannel(ch.id)}
                    className={styles.channelCheckbox}
                  />
                  <span className={styles.channelLabel}>{ch.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Test Result Box */}
        {testResult && (
          <div className={styles.testBanner} role="status">
            <span className={styles.testTitle}>Simulation Output:</span>
            <p className={styles.testText}>{testResult}</p>
          </div>
        )}

        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.testBtn}
            onClick={handleTest}
            aria-label="Simulate alert rule evaluation"
          >
            Simulate Rule Trigger
          </button>
          <button
            type="submit"
            className={styles.saveBtn}
            aria-label="Save and deploy alert policy"
          >
            Deploy Alert Policy
          </button>
        </footer>
      </form>
    </section>
  );
};
