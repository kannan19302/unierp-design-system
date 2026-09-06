import React, { useId, useState } from "react";
import styles from "./bank-rule-condition-builder.module.css";

export type RuleField = "description" | "amount" | "payee" | "reference";
export type RuleOperator =
  | "contains"
  | "equals"
  | "starts_with"
  | "greater_than"
  | "less_than";

export interface RuleCondition {
  id: string;
  field: RuleField;
  operator: RuleOperator;
  value: string;
}

export interface BankRule {
  id: string;
  name: string;
  priority: number;
  matchType: "all" | "any";
  targetAccount: string;
  conditions: RuleCondition[];
  actionType: "spend_money" | "receive_money" | "transfer";
  payee: string;
  glAccount: string;
  taxCode: string;
  autoReconcile: boolean;
}

export interface BankRuleConditionBuilderProps {
  initialRule?: Partial<BankRule>;
  bankAccounts?: string[];
  glAccounts?: { code: string; name: string }[];
  onSaveRule?: (rule: BankRule) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const BankRuleConditionBuilder: React.FC<BankRuleConditionBuilderProps> = ({
  initialRule,
  bankAccounts = [
    "SVB Operating Checking (*9941)",
    "JPMorgan Chase Treasury Clearing (*2204)",
    "Barclays Euro Liquidity (*8812)",
  ],
  glAccounts = [
    { code: "6120", name: "Cloud Infrastructure & Hosting (AWS/GCP)" },
    { code: "6140", name: "Software Subscriptions & SaaS Licenses" },
    { code: "6200", name: "Professional Legal & Compliance Services" },
    { code: "2100", name: "Accounts Payable Clearing" },
  ],
  onSaveRule,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();

  const [name, setName] = useState<string>(initialRule?.name || "AWS Cloud Services Auto-Allocation");
  const [priority, setPriority] = useState<number>(initialRule?.priority || 1);
  const [matchType, setMatchType] = useState<"all" | "any">(initialRule?.matchType || "all");
  const [targetAccount, setTargetAccount] = useState<string>(
    initialRule?.targetAccount || (bankAccounts[0] ?? "")
  );
  const [conditions, setConditions] = useState<RuleCondition[]>(
    initialRule?.conditions || [
      { id: "c-1", field: "description", operator: "contains", value: "Amazon Web Services" },
      { id: "c-2", field: "amount", operator: "greater_than", value: "250.00" },
    ]
  );
  const [actionType, setActionType] = useState<"spend_money" | "receive_money" | "transfer">(
    initialRule?.actionType || "spend_money"
  );
  const [payee, setPayee] = useState<string>(initialRule?.payee || "Amazon Web Services Inc");
  const [glAccount, setGlAccount] = useState<string>(
    initialRule?.glAccount || (glAccounts[0]?.code ?? "")
  );
  const [taxCode] = useState<string>(initialRule?.taxCode || "STANDARD-INPUT-20%");

  const [autoReconcile, setAutoReconcile] = useState<boolean>(
    initialRule?.autoReconcile ?? true
  );
  const [simText, setSimText] = useState<string>("POS DEBIT: Amazon Web Services AWS.AMZN.COM/BILL WA US $1,420.50");
  const [simResult, setSimResult] = useState<boolean | null>(null);

  const addCondition = () => {
    const newCond: RuleCondition = {
      id: `c-${Date.now()}`,
      field: "description",
      operator: "contains",
      value: "",
    };
    setConditions([...conditions, newCond]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length <= 1) return;
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const updateCondition = (id: string, field: keyof RuleCondition, val: string) => {
    setConditions(
      conditions.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleSimulate = () => {
    const textLower = simText.toLowerCase();
    const results = conditions.map((c) => {
      const valLower = c.value.toLowerCase();
      if (c.field === "description" || c.field === "payee" || c.field === "reference") {
        if (c.operator === "contains") return textLower.includes(valLower);
        if (c.operator === "equals") return textLower === valLower;
        if (c.operator === "starts_with") return textLower.startsWith(valLower);
      }
      if (c.field === "amount") {
        const num = parseFloat(c.value);
        return !isNaN(num) && num > 0;
      }
      return false;
    });

    const passed = matchType === "all" ? results.every(Boolean) : results.some(Boolean);
    setSimResult(passed);
  };

  const handleSave = () => {
    const fullRule: BankRule = {
      id: initialRule?.id || `rule-${Date.now()}`,
      name,
      priority,
      matchType,
      targetAccount,
      conditions,
      actionType,
      payee,
      glAccount,
      taxCode,
      autoReconcile,
    };
    onSaveRule?.(fullRule);
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            ⚡
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.ruleBadge}>Priority #{priority}</span>
              <span className={styles.accountTag}>{targetAccount}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Bank Statement Automation Rule Builder
            </h2>
          </div>
        </div>

        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          Save &amp; Activate Rule
        </button>
      </header>

      {/* Rule Definition Form */}
      <div className={styles.formGrid}>
        {/* Name & Target */}
        <div className={styles.fieldRow}>
          <div className={styles.inputWrap}>
            <label htmlFor={`${headingId}-name`} className={styles.label}>
              Rule Name:
            </label>
            <input
              id={`${headingId}-name`}
              type="text"
              className={styles.textInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputWrap}>
            <label htmlFor={`${headingId}-acct`} className={styles.label}>
              Apply to Bank Account:
            </label>
            <select
              id={`${headingId}-acct`}
              className={styles.selectInput}
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
            >
              {bankAccounts.map((acct) => (
                <option key={acct} value={acct}>
                  {acct}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputWrapNarrow}>
            <label htmlFor={`${headingId}-priority`} className={styles.label}>
              Priority Order:
            </label>
            <input
              id={`${headingId}-priority`}
              type="number"
              min="1"
              max="99"
              className={styles.numInput}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Condition Criteria Section */}
        <div className={styles.criteriaSection}>
          <div className={styles.criteriaHeader}>
            <span className={styles.criteriaTitle}>
              When a statement line matches:
            </span>
            <div className={styles.matchTypeToggle}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`${headingId}-match-type`}
                  value="all"
                  checked={matchType === "all"}
                  onChange={() => setMatchType("all")}
                />
                ALL conditions (AND)
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name={`${headingId}-match-type`}
                  value="any"
                  checked={matchType === "any"}
                  onChange={() => setMatchType("any")}
                />
                ANY condition (OR)
              </label>
            </div>
          </div>

          {/* Condition Rows */}
          <div className={styles.conditionList}>
            {conditions.map((cond, idx) => (
              <div key={cond.id} className={styles.conditionRow}>
                <span className={styles.condNum}>#{idx + 1}</span>

                <select
                  aria-label={`Field for condition ${idx + 1}`}
                  className={styles.selectInput}
                  value={cond.field}
                  onChange={(e) =>
                    updateCondition(cond.id, "field", e.target.value as RuleField)
                  }
                >
                  <option value="description">Description / Memo</option>
                  <option value="amount">Transaction Amount</option>
                  <option value="payee">Payee Name</option>
                  <option value="reference">Reference Code</option>
                </select>

                <select
                  aria-label={`Operator for condition ${idx + 1}`}
                  className={styles.selectInput}
                  value={cond.operator}
                  onChange={(e) =>
                    updateCondition(cond.id, "operator", e.target.value as RuleOperator)
                  }
                >
                  <option value="contains">contains</option>
                  <option value="equals">equals exactly</option>
                  <option value="starts_with">starts with</option>
                  <option value="greater_than">greater than (&gt;)</option>
                  <option value="less_than">less than (&lt;)</option>
                </select>

                <input
                  type="text"
                  aria-label={`Value for condition ${idx + 1}`}
                  className={styles.textInput}
                  placeholder="Enter match pattern..."
                  value={cond.value}
                  onChange={(e) => updateCondition(cond.id, "value", e.target.value)}
                />

                <button
                  type="button"
                  className={styles.removeCondBtn}
                  onClick={() => removeCondition(cond.id)}
                  disabled={conditions.length <= 1}
                  aria-label={`Remove condition ${idx + 1}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button type="button" className={styles.addCondBtn} onClick={addCondition}>
            + Add Another Condition
          </button>
        </div>

        {/* Action Panel */}
        <div className={styles.actionPanel}>
          <h3 className={styles.actionHeading}>THEN Automatically Generate &amp; Allocate:</h3>
          <div className={styles.actionFieldsRow}>
            <div className={styles.inputWrap}>
              <label htmlFor={`${headingId}-action-type`} className={styles.label}>
                Transaction Type:
              </label>
              <select
                id={`${headingId}-action-type`}
                className={styles.selectInput}
                value={actionType}
                onChange={(e) =>
                  setActionType(e.target.value as "spend_money" | "receive_money" | "transfer")
                }
              >
                <option value="spend_money">Spend Money (Vendor Payment)</option>
                <option value="receive_money">Receive Money (Customer Receipt)</option>
                <option value="transfer">Bank Transfer (Inter-Account)</option>
              </select>
            </div>

            <div className={styles.inputWrap}>
              <label htmlFor={`${headingId}-payee`} className={styles.label}>
                Assign Payee:
              </label>
              <input
                id={`${headingId}-payee`}
                type="text"
                className={styles.textInput}
                value={payee}
                onChange={(e) => setPayee(e.target.value)}
              />
            </div>

            <div className={styles.inputWrap}>
              <label htmlFor={`${headingId}-gl`} className={styles.label}>
                General Ledger Account:
              </label>
              <select
                id={`${headingId}-gl`}
                className={styles.selectInput}
                value={glAccount}
                onChange={(e) => setGlAccount(e.target.value)}
              >
                {glAccounts.map((gl) => (
                  <option key={gl.code} value={gl.code}>
                    {gl.code} — {gl.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.checkboxWrap}>
              <label className={styles.autoCheckLabel}>
                <input
                  type="checkbox"
                  checked={autoReconcile}
                  onChange={(e) => setAutoReconcile(e.target.checked)}
                />
                Auto-approve match without manual confirmation
              </label>
            </div>
          </div>
        </div>

        {/* Live Simulator Tester */}
        <div className={styles.simulatorCard}>
          <div className={styles.simHeader}>
            <span className={styles.simTitle}>🧪 Test Rule Against Sample Feed Line</span>
            <button type="button" className={styles.testBtn} onClick={handleSimulate}>
              Simulate Match
            </button>
          </div>
          <input
            type="text"
            className={styles.simInput}
            value={simText}
            onChange={(e) => setSimText(e.target.value)}
            aria-label="Sample statement text for simulation"
          />
          {simResult !== null && (
            <div
              className={`${styles.simResultBadge} ${
                simResult ? styles.simSuccess : styles.simFailure
              }`}
              role="status"
            >
              {simResult
                ? "✓ RULE MATCH SUCCESSFUL: Statement line will automatically trigger GL 6120 allocation."
                : "⛔ RULE DID NOT MATCH: Statement line fails one or more configured conditions."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
