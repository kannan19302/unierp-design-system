import type { Meta, StoryObj } from "@storybook/react";
import {
  QueryExecutionPlanViewer,
  type PlanNode,
} from "./query-execution-plan-viewer";

const mockPlan: PlanNode = {
  id: "node-root",
  operation: "aggregate",
  costPercent: 12,
  totalCost: 12450,
  actualRows: 1,
  estimatedRows: 1,
  durationMs: 4.2,
  children: [
    {
      id: "node-sort",
      operation: "sort",
      costPercent: 10,
      totalCost: 11200,
      actualRows: 450,
      estimatedRows: 450,
      durationMs: 8.5,
      children: [
        {
          id: "node-join",
          operation: "hash_join",
          costPercent: 18,
          totalCost: 9800,
          actualRows: 450,
          estimatedRows: 450,
          durationMs: 14.1,
          filterPredicate: "orders.customer_id = customers.id",
          children: [
            {
              id: "node-seq-scan",
              operation: "seq_scan",
              relationName: "orders",
              costPercent: 52,
              totalCost: 6500,
              actualRows: 85000,
              estimatedRows: 10000,
              durationMs: 82.4,
              filterPredicate: "orders.created_at >= '2026-01-01'",
            },
            {
              id: "node-idx-scan",
              operation: "index_scan",
              relationName: "customers",
              indexName: "idx_customers_pkey",
              costPercent: 8,
              totalCost: 1200,
              actualRows: 450,
              estimatedRows: 450,
              durationMs: 3.2,
            },
          ],
        },
      ],
    },
  ],
};

const meta: Meta<typeof QueryExecutionPlanViewer> = {
  title: "DataDisplay/QueryExecutionPlanViewer",
  component: QueryExecutionPlanViewer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof QueryExecutionPlanViewer>;

export const Default: Story = {
  args: {
    queryTitle: "SELECT c.name, SUM(o.amount) FROM orders o JOIN customers c ON ...",
    totalDurationMs: 112.4,
    totalCostUnits: 12450,
    rootNode: mockPlan,
  },
};

export const Compact: Story = {
  args: {
    queryTitle: "EXPLAIN ANALYZE SELECT * FROM orders WHERE ...",
    totalDurationMs: 82.4,
    totalCostUnits: 6500,
    rootNode: mockPlan.children![0].children![0].children![0],
    density: "compact",
  },
};
