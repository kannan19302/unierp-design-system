"use client";

import {
  forwardRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import styles from "./policy-simulator-inspector.module.css";

export type PolicyAction = "READ" | "WRITE" | "DELETE" | "APPROVE" | "EXPORT";
export type PolicyDecision = "ALLOW" | "DENY";

export interface SimulationResult {
  decision: PolicyDecision;
  matchedRule: string;
  tenantScoped: boolean;
  tenantId?: string;
  maskedFields?: string[];
  deniedReason?: string;
}

export interface PolicySimulatorInspectorProps {
  /** Initial subject / principal (user, role, or service account) */
  defaultSubject?: string;
  /** Initial resource target e.g. "Vendor #VND-104" */
  defaultResource?: string;
  /** Initial operation */
  defaultAction?: PolicyAction;
  /** Live evaluation result */
  result?: SimulationResult | null;
  /** Callback triggered to evaluate the policy */
  onSimulate: (params: {
    subject: string;
    resource: string;
    action: PolicyAction;
  }) => void;
  /** Title header */
  title?: string;
  className?: string;
  style?: CSSProperties;
}

const ACTION_OPTIONS: PolicyAction[] = [
  "READ",
  "WRITE",
  "DELETE",
  "APPROVE",
  "EXPORT",
];

/**
 * `<PolicySimulatorInspector>` — Security rule evaluation testbed verifying tenant RLS and field masking before policy deployment.
 *
 * @maturity stable
 */
export const PolicySimulatorInspector = forwardRef<
  HTMLDivElement,
  PolicySimulatorInspectorProps
>(
  (
    {
      defaultSubject = "sarah.chen@acme.corp",
      defaultResource = "Vendor #VND-104",
      defaultAction = "READ",
      result,
      onSimulate,
      title = "Policy Evaluation Simulator",
      className,
      style,
    },
    ref,
  ) => {
    const [subject, setSubject] = useState(defaultSubject);
    const [resource, setResource] = useState(defaultResource);
    const [action, setAction] = useState<PolicyAction>(defaultAction);

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSimulate({ subject, resource, action });
    };

    const containerClasses = [styles.simulator, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={style}
        role="region"
        aria-label={title}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.desc}>
            Test principal access against PostgreSQL RLS and field policies without mutating live data.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="sim-subject" className={styles.label}>
              Subject (Principal / Role)
            </label>
            <input
              id="sim-subject"
              type="text"
              className={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. user@domain.com or ROLE_FINANCE"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="sim-resource" className={styles.label}>
              Target Resource / Record
            </label>
            <input
              id="sim-resource"
              type="text"
              className={styles.input}
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              placeholder="e.g. Invoices or Customer #1092"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="sim-action" className={styles.label}>
              Requested Action
            </label>
            <select
              id="sim-action"
              className={styles.select}
              value={action}
              onChange={(e) => setAction(e.target.value as PolicyAction)}
            >
              {ACTION_OPTIONS.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            aria-label="Simulate policy evaluation"
          >
            Run Policy Simulation
          </button>
        </form>

        {result && (
          <div className={styles.resultCard}>
            <div className={styles.decisionHeader}>
              <span className={styles.decisionLabel}>Simulation Decision:</span>
              <span className={`${styles.decisionPill} ${styles[result.decision]}`}>
                {result.decision}
              </span>
            </div>

            <div className={styles.kvList}>
              <div className={styles.kvRow}>
                <span className={styles.key}>Matched Rule:</span>
                <span className={styles.val}>{result.matchedRule}</span>
              </div>
              <div className={styles.kvRow}>
                <span className={styles.key}>Tenant Scope:</span>
                <span className={styles.val}>
                  {result.tenantScoped
                    ? `Enforced (${result.tenantId ?? "00000000-0000-0000-0000-000000000001"})`
                    : "Universal / Bypass"}
                </span>
              </div>
              {result.maskedFields && result.maskedFields.length > 0 && (
                <div className={styles.kvRow}>
                  <span className={styles.key}>Masked Fields:</span>
                  <span className={styles.val}>
                    {result.maskedFields.join(", ")}
                  </span>
                </div>
              )}
              {result.deniedReason && (
                <div className={styles.kvRow}>
                  <span className={styles.key}>Denial Rationale:</span>
                  <span className={styles.deniedText}>{result.deniedReason}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

PolicySimulatorInspector.displayName = "PolicySimulatorInspector";
