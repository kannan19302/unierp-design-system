import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  QueryExecutionPlanViewer,
  type PlanNode,
} from "./query-execution-plan-viewer";

const testPlan: PlanNode = {
  id: "node-root",
  operation: "aggregate",
  costPercent: 20,
  totalCost: 1000,
  actualRows: 10,
  estimatedRows: 10,
  durationMs: 5.0,
  children: [
    {
      id: "node-scan",
      operation: "seq_scan",
      relationName: "orders",
      costPercent: 80,
      totalCost: 800,
      actualRows: 100,
      estimatedRows: 100,
      durationMs: 20.0,
    },
  ],
};

describe("QueryExecutionPlanViewer", () => {
  it("renders query title and operations correctly", () => {
    render(
      <QueryExecutionPlanViewer
        queryTitle="SELECT * FROM orders"
        rootNode={testPlan}
      />
    );

    expect(screen.getByText("SELECT * FROM orders")).toBeInTheDocument();
    expect(screen.getAllByText("AGGREGATE").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("SEQ SCAN")).toBeInTheDocument();
    expect(screen.getByText("on orders")).toBeInTheDocument();
  });

  it("selects a plan node and fires onSelectNode callback", () => {
    const onSelect = vi.fn();
    render(
      <QueryExecutionPlanViewer
        rootNode={testPlan}
        onSelectNode={onSelect}
      />
    );

    const scanCard = screen.getByText("on orders");
    fireEvent.click(scanCard);

    expect(onSelect).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <QueryExecutionPlanViewer
        queryTitle="SELECT * FROM orders"
        rootNode={testPlan}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
