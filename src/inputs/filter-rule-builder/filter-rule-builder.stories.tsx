import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterRuleBuilder, type FilterRuleItem } from "./filter-rule-builder";

/**
 * ## FilterRuleBuilder Primitive
 *
 * Visual query predicate builder supporting structured Boolean conditions (WHERE / AND),
 * dynamic field dropdowns, relational operators (equals, contains, greater_than, in), and value inputs.
 *
 * ### Key Capabilities
 * - **Combinator Logic**: First rule bound to `WHERE`, subsequent clauses bound to `AND`.
 * - **Extensible Operators**: Supports text, numerical, and list comparison operators.
 * - **Capacity Bounding**: Configurable `maxRules` constraint with counter indicator.
 * - **4-Tier Density Ergonomics**: Ultra-compact (24px) through comfortable (40px) scaling.
 */
const meta: Meta<typeof FilterRuleBuilder> = {
  title: "Core/Inputs/FilterRuleBuilder",
  component: FilterRuleBuilder,
  tags: ["autodocs"],
  parameters: {
    a11y: { test: "error" },
    docs: {
      description: {
        component:
          "Enterprise boolean filter rule builder with relational operators, field selectors, and 4-tier density scaling.",
      },
    },
  },
  argTypes: {
    rules: { control: "object", description: "Array of FilterRuleItem predicates." },
    maxRules: { control: "number", description: "Maximum allowable predicate rules." },
    density: { control: "select", options: ["ultra-compact", "compact", "standard", "comfortable"], description: "Ergonomic density scaling." },
  },
};

export default meta;
type Story = StoryObj<typeof FilterRuleBuilder>;

const sampleFields = [
  { value: "status", label: "Workflow Status" },
  { value: "amount", label: "Invoice Amount ($)" },
  { value: "vendor", label: "Vendor Partner" },
  { value: "costCenter", label: "Cost Center Code" },
  { value: "createdAt", label: "Creation Date" },
];

export const Default: Story = {
  render: () => {
    const [rules, setRules] = useState<FilterRuleItem[]>([
      { id: "1", field: "status", operator: "equals", value: "active" },
      { id: "2", field: "amount", operator: "greater_than", value: "10000" },
    ]);
    return (
      <div style={{ maxWidth: "600px" }}>
        <FilterRuleBuilder
          rules={rules}
          availableFields={sampleFields}
          onRulesChange={setRules}
        />
      </div>
    );
  },
};

export const AnatomyAndComposition = () => {
  const [rules, setRules] = useState<FilterRuleItem[]>([
    { id: "r1", field: "costCenter", operator: "equals", value: "CC-9040" },
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "600px" }}>
      <div style={{ padding: "var(--space-4)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
        <h4 style={{ margin: "0 0 var(--space-3) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Procurement Audit Query Expression
        </h4>
        <FilterRuleBuilder
          rules={rules}
          availableFields={sampleFields}
          onRulesChange={setRules}
        />
      </div>
    </div>
  );
};

export const AllStatesGallery = () => {
  const sampleRules: FilterRuleItem[] = [
    { id: "a", field: "status", operator: "equals", value: "pending" },
    { id: "b", field: "amount", operator: "greater_than", value: "50000" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", maxWidth: "640px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
        <h4 style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          4-Tier Ergonomic Density Matrix
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div data-density="ultra-compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterRuleBuilder density="ultra-compact" rules={sampleRules} availableFields={sampleFields} />
          </div>
          <div data-density="compact" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterRuleBuilder density="compact" rules={sampleRules} availableFields={sampleFields} />
          </div>
          <div data-density="standard" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterRuleBuilder density="standard" rules={sampleRules} availableFields={sampleFields} />
          </div>
          <div data-density="comfortable" style={{ padding: "var(--space-2)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
            <FilterRuleBuilder density="comfortable" rules={sampleRules} availableFields={sampleFields} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const V1WorkspacePreview = () => {
  const [rules, setRules] = useState<FilterRuleItem[]>([
    { id: "1", field: "status", operator: "equals", value: "active" },
    { id: "2", field: "amount", operator: "greater_than", value: "25000" },
    { id: "3", field: "vendor", operator: "contains", value: "Acme" },
  ]);

  return (
    <div style={{ padding: "var(--space-6)", background: "var(--color-bg-canvas)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "680px" }}>
      <div style={{ marginBottom: "var(--space-4)" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)" }}>
          Compliance Audit Rule Engine
        </h3>
        <p style={{ margin: "var(--space-1) 0 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Compose multi-clause relational predicate rules for high-risk accounts receivable transactions.
        </p>
      </div>

      <FilterRuleBuilder
        rules={rules}
        availableFields={sampleFields}
        onRulesChange={setRules}
        density="standard"
        maxRules={6}
      />

      <div style={{ marginTop: "var(--space-4)", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
          Rules evaluated sequentially using boolean AND logic
        </span>
      </div>
    </div>
  );
};

export const StateMatrix = () => {
  const singleRule: FilterRuleItem[] = [{ id: "1", field: "status", operator: "equals", value: "posted" }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: "600px" }}>
      <FilterRuleBuilder rules={singleRule} availableFields={sampleFields} />
      <FilterRuleBuilder rules={[]} availableFields={sampleFields} />
    </div>
  );
};
