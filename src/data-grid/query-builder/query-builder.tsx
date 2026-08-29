"use client";

import { useState, type ReactNode, type FC } from "react";
import { Plus, Trash2, Filter, Layers } from "lucide-react";
import styles from "./query-builder.module.css";

export type FieldType = "string" | "number" | "boolean" | "date" | "select";

export interface QueryField {
  name: string;
  label: string;
  type: FieldType;
  options?: Array<{ label: string; value: string | number }>;
}

export type QueryOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "starts_with"
  | "ends_with"
  | "greater_than"
  | "less_than"
  | "greater_or_equal"
  | "less_or_equal"
  | "is_empty"
  | "is_not_empty";

export interface QueryRule {
  id: string;
  field: string;
  operator: QueryOperator;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: "AND" | "OR";
  rules: Array<QueryRule | QueryGroup>;
}

export interface QueryBuilderProps {
  fields: QueryField[];
  initialQuery?: QueryGroup;
  onChange?: (query: QueryGroup) => void;
  showPreview?: boolean;
  className?: string;
}

const DEFAULT_OPERATORS: Record<FieldType, QueryOperator[]> = {
  string: ["contains", "equals", "not_equals", "starts_with", "ends_with", "is_empty", "is_not_empty"],
  number: ["equals", "not_equals", "greater_than", "less_than", "greater_or_equal", "less_or_equal"],
  date: ["equals", "greater_than", "less_than", "greater_or_equal", "less_or_equal"],
  boolean: ["equals"],
  select: ["equals", "not_equals"],
};

export const QueryBuilder: FC<QueryBuilderProps> = ({
  fields,
  initialQuery,
  onChange,
  showPreview = true,
  className = "",
}) => {
  const [rootGroup, setRootGroup] = useState<QueryGroup>(
    initialQuery ?? {
      id: "root",
      combinator: "AND",
      rules: [
        {
          id: "r1",
          field: fields[0]?.name ?? "status",
          operator: "equals",
          value: "",
        },
      ],
    }
  );

  const updateQuery = (nextGroup: QueryGroup) => {
    setRootGroup(nextGroup);
    onChange?.(nextGroup);
  };

  const addRule = (groupId: string) => {
    const newRule: QueryRule = {
      id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      field: fields[0]?.name ?? "",
      operator: "equals",
      value: "",
    };

    const traverseAndAdd = (group: QueryGroup): QueryGroup => {
      if (group.id === groupId) {
        return { ...group, rules: [...group.rules, newRule] };
      }
      return {
        ...group,
        rules: group.rules.map((item) =>
          "combinator" in item ? traverseAndAdd(item) : item
        ),
      };
    };

    updateQuery(traverseAndAdd(rootGroup));
  };

  const addSubGroup = (groupId: string) => {
    const newGroup: QueryGroup = {
      id: `g_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      combinator: "AND",
      rules: [
        {
          id: `r_${Date.now()}_1`,
          field: fields[0]?.name ?? "",
          operator: "equals",
          value: "",
        },
      ],
    };

    const traverseAndAdd = (group: QueryGroup): QueryGroup => {
      if (group.id === groupId) {
        return { ...group, rules: [...group.rules, newGroup] };
      }
      return {
        ...group,
        rules: group.rules.map((item) =>
          "combinator" in item ? traverseAndAdd(item) : item
        ),
      };
    };

    updateQuery(traverseAndAdd(rootGroup));
  };

  const removeNode = (nodeId: string) => {
    const traverseAndRemove = (group: QueryGroup): QueryGroup => {
      return {
        ...group,
        rules: group.rules
          .filter((item) => item.id !== nodeId)
          .map((item) => ("combinator" in item ? traverseAndRemove(item) : item)),
      };
    };

    updateQuery(traverseAndRemove(rootGroup));
  };

  const updateRule = (ruleId: string, patch: Partial<QueryRule>) => {
    const traverseAndUpdate = (group: QueryGroup): QueryGroup => {
      return {
        ...group,
        rules: group.rules.map((item) => {
          if ("combinator" in item) return traverseAndUpdate(item);
          if (item.id === ruleId) return { ...item, ...patch };
          return item;
        }),
      };
    };

    updateQuery(traverseAndUpdate(rootGroup));
  };

  const updateCombinator = (groupId: string, combinator: "AND" | "OR") => {
    const traverseAndUpdate = (group: QueryGroup): QueryGroup => {
      if (group.id === groupId) return { ...group, combinator };
      return {
        ...group,
        rules: group.rules.map((item) =>
          "combinator" in item ? traverseAndUpdate(item) : item
        ),
      };
    };

    updateQuery(traverseAndUpdate(rootGroup));
  };

  const renderGroup = (group: QueryGroup, isRoot = false): ReactNode => {
    return (
      <div key={group.id} className={styles.group}>
        <div className={styles.groupHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Filter size={14} style={{ color: "var(--color-brand)" }} />
            <select
              className={styles.combinatorSelect}
              value={group.combinator}
              onChange={(e) => updateCombinator(group.id, e.target.value as "AND" | "OR")}
              aria-label="Condition combinator"
            >
              <option value="AND">MATCH ALL (AND)</option>
              <option value="OR">MATCH ANY (OR)</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <button
              type="button"
              className={styles.btn}
              onClick={() => addRule(group.id)}
              aria-label="Add condition rule"
            >
              <Plus size={14} /> Add Rule
            </button>
            <button
              type="button"
              className={styles.btn}
              onClick={() => addSubGroup(group.id)}
              aria-label="Add condition group"
            >
              <Layers size={14} /> Add Group
            </button>
            {!isRoot && (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={() => removeNode(group.id)}
                aria-label="Remove group"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.rulesList}>
          {group.rules.map((item) => {
            if ("combinator" in item) {
              return renderGroup(item, false);
            }

            const currentField = fields.find((f) => f.name === item.field) ?? fields[0];
            const ops = currentField ? DEFAULT_OPERATORS[currentField.type] : DEFAULT_OPERATORS.string;
            const requiresValue = item.operator !== "is_empty" && item.operator !== "is_not_empty";

            return (
              <div key={item.id} className={styles.ruleRow}>
                <select
                  className={styles.fieldSelect}
                  value={item.field}
                  onChange={(e) => updateRule(item.id, { field: e.target.value, value: "" })}
                  aria-label="Filter field"
                >
                  {fields.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </select>

                <select
                  className={styles.operatorSelect}
                  value={item.operator}
                  onChange={(e) => updateRule(item.id, { operator: e.target.value as QueryOperator })}
                  aria-label="Filter operator"
                >
                  {ops.map((op) => (
                    <option key={op} value={op}>
                      {op.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>

                {requiresValue && (
                  <>
                    {currentField?.type === "select" && currentField.options ? (
                      <select
                        className={styles.valueInput}
                        value={item.value}
                        onChange={(e) => updateRule(item.id, { value: e.target.value })}
                        aria-label="Filter select value"
                      >
                        <option value="">-- Select --</option>
                        {currentField.options.map((opt) => (
                          <option key={String(opt.value)} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : currentField?.type === "boolean" ? (
                      <select
                        className={styles.valueInput}
                        value={String(item.value)}
                        onChange={(e) => updateRule(item.id, { value: e.target.value === "true" })}
                        aria-label="Filter boolean value"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <input
                        type={currentField?.type === "number" ? "number" : currentField?.type === "date" ? "date" : "text"}
                        className={styles.valueInput}
                        placeholder="Value..."
                        value={item.value}
                        onChange={(e) => updateRule(item.id, { value: e.target.value })}
                        aria-label="Filter input value"
                      />
                    )}
                  </>
                )}

                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => removeNode(item.id)}
                  aria-label="Remove condition rule"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", fontWeight: 600 }}>Advanced Filter Rules</h4>
      </div>

      {renderGroup(rootGroup, true)}

      {showPreview && (
        <div className={styles.preview}>
          <strong>SQL Filter Expression:</strong>
          <div>{serializeToSQL(rootGroup)}</div>
        </div>
      )}
    </div>
  );
};

function serializeToSQL(group: QueryGroup): string {
  if (!group.rules || group.rules.length === 0) return "1 = 1";

  const expressions = group.rules.map((item) => {
    if ("combinator" in item) {
      return `(${serializeToSQL(item)})`;
    }

    const opMap: Record<QueryOperator, string> = {
      equals: "=",
      not_equals: "!=",
      contains: "ILIKE",
      starts_with: "ILIKE",
      ends_with: "ILIKE",
      greater_than: ">",
      less_than: "<",
      greater_or_equal: ">=",
      less_or_equal: "<=",
      is_empty: "IS NULL",
      is_not_empty: "IS NOT NULL",
    };

    const sqlOp = opMap[item.operator] || "=";

    if (item.operator === "is_empty" || item.operator === "is_not_empty") {
      return `${item.field} ${sqlOp}`;
    }

    let val = item.value;
    if (item.operator === "contains") val = `'%${val}%'`;
    else if (item.operator === "starts_with") val = `'${val}%'`;
    else if (item.operator === "ends_with") val = `'%${val}'`;
    else if (typeof val === "string") val = `'${val}'`;

    return `${item.field} ${sqlOp} ${val}`;
  });

  return expressions.join(` ${group.combinator} `);
}
