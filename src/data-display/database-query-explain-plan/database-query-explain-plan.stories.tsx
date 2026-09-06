import type { Meta, StoryObj } from "@storybook/react";
import { DatabaseQueryExplainPlan } from "./database-query-explain-plan";

const meta: Meta<typeof DatabaseQueryExplainPlan> = {
  title: "Data Display/DatabaseQueryExplainPlan",
  component: DatabaseQueryExplainPlan,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DatabaseQueryExplainPlan>;

const samplePlanTree = {
  id: "node-hash-join",
  nodeType: "Hash Join",
  actualStartupTimeMs: 4.82,
  actualTotalTimeMs: 18.42,
  actualRows: 420,
  planRows: 400,
  totalCost: 425.2,
  filter: "(o.status = 'COMPLETED'::order_status)",
  children: [
    {
      id: "node-seq-scan",
      nodeType: "Seq Scan",
      relationName: "orders",
      actualStartupTimeMs: 0.05,
      actualTotalTimeMs: 12.1,
      actualRows: 12400,
      planRows: 12000,
      totalCost: 310.5,
      filter: "(created_at >= '2026-01-01'::timestamp)",
      isProblematic: true,
      problemWarning: "Full table scan on 12,400 rows without index on created_at column.",
    },
    {
      id: "node-hash",
      nodeType: "Hash",
      actualStartupTimeMs: 2.1,
      actualTotalTimeMs: 2.1,
      actualRows: 85,
      planRows: 80,
      totalCost: 45.0,
      children: [
        {
          id: "node-index-scan",
          nodeType: "Index Scan",
          relationName: "tenants",
          indexName: "idx_tenants_tier_active",
          actualStartupTimeMs: 0.08,
          actualTotalTimeMs: 1.85,
          actualRows: 85,
          planRows: 80,
          totalCost: 42.0,
          indexCond: "(subscription_tier = 'ENTERPRISE'::text AND is_active = true)",
        },
      ],
    },
  ],
};

export const Default: Story = {
  args: {
    querySql:
      "SELECT o.id, o.amount, t.company_name FROM orders o JOIN tenants t ON o.tenant_id = t.id WHERE o.created_at >= '2026-01-01' AND t.subscription_tier = 'ENTERPRISE';",
    planningTimeMs: 0.85,
    executionTimeMs: 18.42,
    totalCost: 425.2,
    rootNode: samplePlanTree,
    selectedNodeId: "node-seq-scan",
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
