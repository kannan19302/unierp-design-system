"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { Plus, X } from "lucide-react";
import styles from "./filter-rule-builder.module.css";

export interface FilterRuleItem {
  id: string;
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "in";
  value: string;
}

export interface FilterRuleBuilderProps extends HTMLAttributes<HTMLDivElement> {
  rules?: FilterRuleItem[];
  onRulesChange?: (rules: FilterRuleItem[]) => void;
  availableFields?: Array<{ value: string; label: string }>;
  maxRules?: number;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

export const FilterRuleBuilder = forwardRef<HTMLDivElement, FilterRuleBuilderProps>(
  (
    {
      rules: initialRules = [
        { id: "rule-1", field: "status", operator: "equals", value: "active" },
      ],
      onRulesChange,
      availableFields = [
        { value: "status", label: "Status" },
        { value: "amount", label: "Amount" },
        { value: "createdAt", label: "Created Date" },
        { value: "assignee", label: "Assignee" },
      ],
      maxRules = 10,
      density,
      className = "",
      ...props
    },
    ref
  ) => {
    const [rules, setRules] = useState<FilterRuleItem[]>(initialRules);

    const handleAddRule = () => {
      if (rules.length >= maxRules) return;
      const newRule: FilterRuleItem = {
        id: `rule-${Date.now()}`,
        field: availableFields[0]?.value || "status",
        operator: "equals",
        value: "",
      };
      const updated = [...rules, newRule];
      setRules(updated);
      onRulesChange?.(updated);
    };

    const handleRemoveRule = (id: string) => {
      const updated = rules.filter((r) => r.id !== id);
      setRules(updated);
      onRulesChange?.(updated);
    };

    const handleRuleChange = (
      id: string,
      field: keyof FilterRuleItem,
      val: string
    ) => {
      const updated = rules.map((r) =>
        r.id === id ? { ...r, [field]: val } : r
      );
      setRules(updated);
      onRulesChange?.(updated);
    };

    return (
      <div
        ref={ref}
        data-density={density}
        className={`${styles.container} ${density ? styles[density] : ""} ${className}`.trim()}
        role="region"
        aria-label="Filter Rule Builder"
        {...props}
      >
        <div className={styles.header}>
          <span className={styles.title}>Filter Criteria</span>
          <span className={styles.ruleCount}>
            {rules.length} / {maxRules} rules
          </span>
        </div>

        <div className={styles.rulesList} role="list" aria-label="Active rules">
          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              className={styles.ruleRow}
              role="listitem"
              data-testid={`filter-rule-${idx}`}
            >
              <span className={styles.combinator}>
                {idx === 0 ? "WHERE" : "AND"}
              </span>

              <select
                className={styles.select}
                value={rule.field}
                aria-label={`Field for rule ${idx + 1}`}
                onChange={(e) =>
                  handleRuleChange(rule.id, "field", e.target.value)
                }
              >
                {availableFields.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              <select
                className={styles.select}
                value={rule.operator}
                aria-label={`Operator for rule ${idx + 1}`}
                onChange={(e) =>
                  handleRuleChange(
                    rule.id,
                    "operator",
                    e.target.value as FilterRuleItem["operator"]
                  )
                }
              >
                <option value="equals">equals</option>
                <option value="contains">contains</option>
                <option value="greater_than">greater than</option>
                <option value="less_than">less than</option>
                <option value="in">in list</option>
              </select>

              <input
                type="text"
                className={styles.input}
                value={rule.value}
                placeholder="Enter value..."
                aria-label={`Value for rule ${idx + 1}`}
                onChange={(e) =>
                  handleRuleChange(rule.id, "value", e.target.value)
                }
              />

              <button
                type="button"
                className={styles.removeBtn}
                aria-label={`Remove rule ${idx + 1}`}
                onClick={() => handleRemoveRule(rule.id)}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        {rules.length < maxRules && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAddRule}
          >
            <Plus size={14} aria-hidden="true" />
            <span>Add Filter Condition</span>
          </button>
        )}
      </div>
    );
  }
);

FilterRuleBuilder.displayName = "FilterRuleBuilder";
