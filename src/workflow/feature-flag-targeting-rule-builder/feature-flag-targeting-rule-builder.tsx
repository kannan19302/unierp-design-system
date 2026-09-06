import React, { useId, useState } from "react";
import styles from "./feature-flag-targeting-rule-builder.module.css";

export type RuleOperator =
  | "is_one_of"
  | "is_not_one_of"
  | "contains"
  | "starts_with"
  | "greater_than"
  | "matches_regex";

export interface RuleClause {
  id: string;
  attribute: string; // "country", "tenant_id", "email", "subscription_tier"
  operator: RuleOperator;
  values: string[]; // ["US", "CA", "GB"]
}

export interface TargetingRule {
  id: string;
  name: string;
  clauses: RuleClause[];
  serveVariationId: string;
  rolloutPercentage?: number; // 0 - 100
}

export interface FlagVariation {
  id: string;
  name: string;
  value: string | boolean | number;
}

export interface FeatureFlagTargetingRuleBuilderProps {
  flagKey: string; // "release-v2-finance-settlement"
  flagName: string; // "V2 Real-Time Settlement Engine"
  enabled: boolean;
  variations: FlagVariation[];
  rules: TargetingRule[];
  defaultOffVariationId: string;
  onSaveRules?: (rules: TargetingRule[]) => void;
  onToggleEnabled?: (enabled: boolean) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const FeatureFlagTargetingRuleBuilder: React.FC<FeatureFlagTargetingRuleBuilderProps> = ({
  flagKey,
  flagName,
  enabled: initialEnabled = true,
  variations,
  rules: initialRules = [],
  defaultOffVariationId,
  onSaveRules,
  onToggleEnabled,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [rules, setRules] = useState<TargetingRule[]>(initialRules);

  // Simulation test sandbox state
  const [testUserJson, setTestUserJson] = useState(
    JSON.stringify({ tenant_id: "acme-corp", country: "US", subscription_tier: "ENTERPRISE" }, null, 2)
  );
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    onToggleEnabled?.(next);
  };

  const handleAddRule = () => {
    const newRule: TargetingRule = {
      id: `rule-${Date.now()}`,
      name: `Targeting Rule #${rules.length + 1}`,
      clauses: [
        {
          id: `clause-${Date.now()}`,
          attribute: "subscription_tier",
          operator: "is_one_of",
          values: ["ENTERPRISE"],
        },
      ],
      serveVariationId: variations[0]?.id ?? "",
      rolloutPercentage: 100,
    };
    const updated = [...rules, newRule];
    setRules(updated);
  };

  const handleDeleteRule = (ruleId: string) => {
    const updated = rules.filter((r) => r.id !== ruleId);
    setRules(updated);
  };

  const handleClauseChange = (
    ruleId: string,
    clauseId: string,
    field: "attribute" | "operator" | "values",
    val: string
  ) => {
    const updated = rules.map((r) => {
      if (r.id !== ruleId) return r;
      return {
        ...r,
        clauses: r.clauses.map((c) => {
          if (c.id !== clauseId) return c;
          if (field === "values") {
            return { ...c, values: val.split(",").map((s) => s.trim()).filter(Boolean) };
          }
          return { ...c, [field]: val };
        }),
      };
    });
    setRules(updated);
  };

  const handleServeVariationChange = (ruleId: string, varId: string) => {
    const updated = rules.map((r) => (r.id === ruleId ? { ...r, serveVariationId: varId } : r));
    setRules(updated);
  };

  const handleSimulate = () => {
    if (!enabled) {
      const offVar = variations.find((v) => v.id === defaultOffVariationId);
      setEvaluationResult(`Flag is OFF -> Serving Default Off: [${offVar?.name ?? "Off"}]`);
      return;
    }

    try {
      const user = JSON.parse(testUserJson) as Record<string, string>;
      for (const rule of rules) {
        let allClausesMatch = true;
        for (const clause of rule.clauses) {
          const userVal = String(user[clause.attribute] ?? "");
          if (clause.operator === "is_one_of") {
            if (!clause.values.includes(userVal)) allClausesMatch = false;
          } else if (clause.operator === "is_not_one_of") {
            if (clause.values.includes(userVal)) allClausesMatch = false;
          } else if (clause.operator === "contains") {
            if (!clause.values.some((v) => userVal.includes(v))) allClausesMatch = false;
          }
        }
        if (allClausesMatch) {
          const matchedVar = variations.find((v) => v.id === rule.serveVariationId);
          setEvaluationResult(
            `Matched [${rule.name}] -> Serving Variation: "${matchedVar?.name ?? rule.serveVariationId}"`
          );
          return;
        }
      }

      const defaultVar = variations.find((v) => v.id === defaultOffVariationId);
      setEvaluationResult(`No rules matched -> Default Fallback: "${defaultVar?.name ?? "Default"}"`);
    } catch {
      setEvaluationResult("Error: Invalid JSON payload in user context.");
    }
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.metaRow}>
            <span className={styles.flagKeyBadge}>{flagKey}</span>
            <span className={enabled ? styles.flagEnabled : styles.flagDisabled}>
              {enabled ? "ENABLED" : "DISABLED"}
            </span>
          </div>
          <h2 id={headingId} className={styles.title}>
            {flagName}
          </h2>
        </div>

        {/* Global Toggle & Save Controls */}
        <div className={styles.headerActions}>
          <button
            type="button"
            className={enabled ? styles.toggleOnBtn : styles.toggleOffBtn}
            onClick={handleToggle}
            aria-pressed={enabled}
          >
            {enabled ? "Toggle Flag Off" : "Toggle Flag On"}
          </button>
          {onSaveRules && (
            <button
              type="button"
              className={styles.saveBtn}
              onClick={() => onSaveRules(rules)}
            >
              Save Targeting Rules
            </button>
          )}
        </div>
      </header>

      {/* Main Grid: Rules Builder & Evaluation Simulator */}
      <div className={styles.builderGrid}>
        {/* Rules List Area */}
        <div className={styles.rulesArea}>
          <div className={styles.rulesHeader}>
            <h3 className={styles.sectionTitle}>Targeting Rules ({rules.length})</h3>
            <button
              type="button"
              className={styles.addRuleBtn}
              onClick={handleAddRule}
            >
              + Add Targeting Rule
            </button>
          </div>

          {rules.length === 0 ? (
            <div className={styles.emptyRules}>
              <p>No targeting rules configured. All traffic falls back to default variation.</p>
            </div>
          ) : (
            <div className={styles.rulesList}>
              {rules.map((rule, idx) => (
                <div key={rule.id} className={styles.ruleCard}>
                  <div className={styles.ruleCardHeader}>
                    <span className={styles.ruleOrder}>#{idx + 1}</span>
                    <strong className={styles.ruleTitle}>{rule.name}</strong>
                    <button
                      type="button"
                      className={styles.deleteRuleBtn}
                      onClick={() => handleDeleteRule(rule.id)}
                      aria-label={`Delete rule ${rule.name}`}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Clauses */}
                  <div className={styles.clausesList}>
                    {rule.clauses.map((clause) => (
                      <div key={clause.id} className={styles.clauseRow}>
                        <span className={styles.clausePrefix}>IF</span>
                        <input
                          type="text"
                          className={styles.inputAttr}
                          aria-label={`Attribute name for clause in ${rule.name}`}
                          value={clause.attribute}
                          onChange={(e) =>
                            handleClauseChange(rule.id, clause.id, "attribute", e.target.value)
                          }
                          placeholder="attribute"
                        />
                        <select
                          className={styles.selectOperator}
                          aria-label={`Operator for clause in ${rule.name}`}
                          value={clause.operator}
                          onChange={(e) =>
                            handleClauseChange(rule.id, clause.id, "operator", e.target.value)
                          }
                        >
                          <option value="is_one_of">is one of</option>
                          <option value="is_not_one_of">is not one of</option>
                          <option value="contains">contains</option>
                          <option value="starts_with">starts with</option>
                        </select>
                        <input
                          type="text"
                          className={styles.inputValues}
                          aria-label={`Comma-separated values for clause in ${rule.name}`}
                          value={clause.values.join(", ")}
                          onChange={(e) =>
                            handleClauseChange(rule.id, clause.id, "values", e.target.value)
                          }
                          placeholder="Values (comma separated)"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Serve Variation Row */}
                  <div className={styles.serveRow}>
                    <span className={styles.serveLabel}>SERVE:</span>
                    <select
                      className={styles.selectVariation}
                      aria-label={`Serve variation for ${rule.name}`}
                      value={rule.serveVariationId}
                      onChange={(e) => handleServeVariationChange(rule.id, e.target.value)}
                    >
                      {variations.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({String(v.value)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evaluation Simulator Sandbox */}
        <aside className={styles.simulatorArea} aria-label="Rule Evaluation Sandbox">
          <h3 className={styles.sectionTitle}>Context Evaluation Sandbox</h3>
          <p className={styles.simSubtitle}>
            Simulate how a specific user or tenant context evaluates against this flag&rsquo;s targeting rules.
          </p>

          <div className={styles.formGroup}>
            <label htmlFor="test-user-context" className={styles.label}>
              Test Evaluation Context (JSON)
            </label>
            <textarea
              id="test-user-context"
              rows={5}
              className={styles.jsonTextarea}
              value={testUserJson}
              onChange={(e) => setTestUserJson(e.target.value)}
            />
          </div>

          <button
            type="button"
            className={styles.simulateBtn}
            onClick={handleSimulate}
          >
            Evaluate Targeting Rule
          </button>

          {evaluationResult && (
            <div className={styles.evalResultBox}>
              <span className={styles.evalResultLabel}>Evaluation Output:</span>
              <p className={styles.evalResultText}>{evaluationResult}</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
