"use client";

import { forwardRef, useState, type HTMLAttributes } from "react";
import { Plus, X } from "lucide-react";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./filter-rule-builder.module.css";

export interface FilterRuleItem {
  id: string;
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "in";
  value: string;
}

export const filterRuleBuilderVariants = cva(styles.container, {
  variants: {
    density: {
      "ultra-compact": styles["ultra-compact"] || "",
      compact: styles.compact || "",
      standard: styles.standard || "",
      comfortable: styles.comfortable || "",
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export interface FilterRuleBuilderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterRuleBuilderVariants> {
  rules?: FilterRuleItem[];
  onRulesChange?: (rules: FilterRuleItem[]) => void;
  availableFields?: Array<{ value: string; label: string }>;
  maxRules?: number;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
}

/**
 * FilterRuleBuilder component providing structured predicate row editing,
 * WHERE/AND combinator logic, relational operators, and 4-tier density scaling.
 * Standardized with cva, data-slot, and accessible listbox/region semantics.
 *
 * @maturity stable
 */
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
        data-slot="filter-rule-builder"
        data-density={density}
        className={`${filterRuleBuilderVariants({ density })} ${className}`.trim()}
        role="region"
        aria-label="Filter Rule Builder"
        {...props}
      >
        <div data-slot="filter-rule-builder-header" className={styles.header}>
          <span data-slot="filter-rule-builder-title" className={styles.title}>Filter Criteria</span>
          <span data-slot="filter-rule-builder-count" className={styles.ruleCount}>
            {rules.length} / {maxRules} rules
          </span>
        </div>

        <div data-slot="filter-rule-builder-list" className={styles.rulesList} role="list" aria-label="Active rules">
          {rules.map((rule, idx) => (
            <div
              key={rule.id}
              data-slot="filter-rule-builder-row"
              className={styles.ruleRow}
              role="listitem"
              data-testid={`filter-rule-${idx}`}
            >
              <span data-slot="filter-rule-builder-combinator" className={styles.combinator}>
                {idx === 0 ? "WHERE" : "AND"}
              </span>

              <select
                data-slot="filter-rule-builder-field"
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
                data-slot="filter-rule-builder-operator"
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
                data-slot="filter-rule-builder-value"
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
                data-slot="filter-rule-builder-remove"
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
            data-slot="filter-rule-builder-add"
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

