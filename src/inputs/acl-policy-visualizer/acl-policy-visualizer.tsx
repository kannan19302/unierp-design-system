import React, { useState, useId } from "react";
import styles from "./acl-policy-visualizer.module.css";

export interface AclCondition {
  key: string;
  operator: "StringEquals" | "StringLike" | "IpAddress" | "NumericLessThan" | "Bool";
  value: string;
}

export interface AclStatement {
  id: string;
  sid: string;
  effect: "allow" | "deny";
  actions: string[];
  resources: string[];
  conditions?: AclCondition[];
}

export interface AclPolicyVisualizerProps {
  /** Policy Document Name */
  policyName?: string;
  /** Initial statement list */
  initialStatements?: AclStatement[];
  /** Callback fired when statements are modified */
  onChange?: (statements: AclStatement[]) => void;
  /** Density level */
  density?: "compact" | "comfortable";
  /** Optional custom CSS class */
  className?: string;
}

const DEFAULT_STATEMENTS: AclStatement[] = [
  {
    id: "stmt-1",
    sid: "TenantSubledgerWriteAccess",
    effect: "allow",
    actions: ["unierp:finance:post_journal", "unierp:finance:reconcile"],
    resources: ["urn:unierp:tenant:${context:tenantId}:subledger/*"],
    conditions: [
      { key: "request:isMfaAuthenticated", operator: "Bool", value: "true" },
      { key: "request:clientIp", operator: "IpAddress", value: "10.0.0.0/16" },
    ],
  },
  {
    id: "stmt-2",
    sid: "DenyCrossTenantExport",
    effect: "deny",
    actions: ["unierp:data:bulk_export"],
    resources: ["*"],
    conditions: [{ key: "request:crossTenantAccess", operator: "Bool", value: "true" }],
  },
];

export const AclPolicyVisualizer: React.FC<AclPolicyVisualizerProps> = ({
  policyName = "Production-ZeroTrust-Tenant-Policy",
  initialStatements = DEFAULT_STATEMENTS,
  onChange,
  density = "compact",
  className,
}) => {
  const policyId = useId();
  const [statements, setStatements] = useState<AclStatement[]>(initialStatements);
  const [activeTab, setActiveTab] = useState<"visual" | "json">("visual");

  const handleToggleEffect = (stmtId: string) => {
    const next = statements.map((s) => {
      if (s.id === stmtId) {
        return { ...s, effect: s.effect === "allow" ? ("deny" as const) : ("allow" as const) };
      }
      return s;
    });
    setStatements(next);
    onChange?.(next);
  };

  const handleAddStatement = () => {
    const newStmt: AclStatement = {
      id: `stmt-${Date.now()}`,
      sid: `CustomPolicyStatement${statements.length + 1}`,
      effect: "allow",
      actions: ["unierp:api:read"],
      resources: ["urn:unierp:resource:*"],
    };
    const next = [...statements, newStmt];
    setStatements(next);
    onChange?.(next);
  };

  const handleRemoveStatement = (stmtId: string) => {
    if (statements.length <= 1) return;
    const next = statements.filter((s) => s.id !== stmtId);
    setStatements(next);
    onChange?.(next);
  };

  const jsonFormatted = JSON.stringify(
    {
      Version: "2026-09-06",
      PolicyName: policyName,
      Statement: statements.map((s) => ({
        Sid: s.sid,
        Effect: s.effect === "allow" ? "Allow" : "Deny",
        Action: s.actions,
        Resource: s.resources,
        Condition: s.conditions?.reduce(
          (acc, c) => ({
            ...acc,
            [c.operator]: { [c.key]: c.value },
          }),
          {}
        ),
      })),
    },
    null,
    2
  );

  return (
    <div
      className={`${styles.container} ${className ?? ""}`}
      data-density={density}
      aria-labelledby={`${policyId}-title`}
    >
      {/* Header Bar */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.iamBadge}>ZERO-TRUST</span>
          <h3 id={`${policyId}-title`} className={styles.title}>
            {policyName}
          </h3>
          <span className={styles.statementCountPill}>
            {statements.length} Policy Statements
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className={styles.viewToggleGroup} role="group" aria-label="Policy editor view mode">
          <button
            type="button"
            className={`${styles.viewBtn} ${activeTab === "visual" ? styles.viewBtnActive : ""}`}
            onClick={() => setActiveTab("visual")}
          >
            Visual Builder
          </button>
          <button
            type="button"
            className={`${styles.viewBtn} ${activeTab === "json" ? styles.viewBtnActive : ""}`}
            onClick={() => setActiveTab("json")}
          >
            JSON AST
          </button>
        </div>
      </div>

      {/* Main Content: Visual vs JSON */}
      {activeTab === "visual" ? (
        <div className={styles.statementsList} role="region" aria-label="Policy statements list">
          {statements.map((stmt) => {
            const isAllow = stmt.effect === "allow";
            return (
              <div
                key={stmt.id}
                className={`${styles.statementCard} ${
                  isAllow ? styles.cardAllow : styles.cardDeny
                }`}
              >
                {/* Statement Top Row */}
                <div className={styles.stmtHeader}>
                  <div className={styles.sidGroup}>
                    <button
                      type="button"
                      className={`${styles.effectBadgeBtn} ${
                        isAllow ? styles.effectAllow : styles.effectDeny
                      }`}
                      onClick={() => handleToggleEffect(stmt.id)}
                      title="Click to toggle between Allow and Deny"
                    >
                      {stmt.effect.toUpperCase()}
                    </button>
                    <span className={styles.sidText}>{stmt.sid}</span>
                  </div>

                  <button
                    type="button"
                    className={styles.removeStmtBtn}
                    onClick={() => handleRemoveStatement(stmt.id)}
                    disabled={statements.length <= 1}
                    aria-label={`Remove statement ${stmt.sid}`}
                  >
                    ×
                  </button>
                </div>

                {/* Actions & Resources Grid */}
                <div className={styles.propsGrid}>
                  <div className={styles.propBlock}>
                    <span className={styles.propLabel}>Actions</span>
                    <div className={styles.tagWrap}>
                      {stmt.actions.map((act, i) => (
                        <span key={i} className={styles.actionTag}>
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={styles.propBlock}>
                    <span className={styles.propLabel}>Resources</span>
                    <div className={styles.tagWrap}>
                      {stmt.resources.map((res, i) => (
                        <span key={i} className={styles.resourceTag}>
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conditions Block */}
                {stmt.conditions && stmt.conditions.length > 0 && (
                  <div className={styles.conditionsBlock}>
                    <span className={styles.propLabel}>Guards &amp; Conditions</span>
                    <div className={styles.conditionsList}>
                      {stmt.conditions.map((cond, idx) => (
                        <div key={idx} className={styles.condItem}>
                          <span className={styles.condOp}>{cond.operator}:</span>
                          <span className={styles.condKey}>{cond.key}</span>
                          <span className={styles.condEq}>=</span>
                          <span className={styles.condVal}>"{cond.value}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.addStmtBtn}
              onClick={handleAddStatement}
            >
              + Add Statement
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.jsonWrapper}>
          <pre className={styles.codeBlock}>{jsonFormatted}</pre>
        </div>
      )}
    </div>
  );
};
