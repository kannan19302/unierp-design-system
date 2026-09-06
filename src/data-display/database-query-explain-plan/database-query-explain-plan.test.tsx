import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { DatabaseQueryExplainPlan } from "./database-query-explain-plan";

describe("DatabaseQueryExplainPlan", () => {
  const samplePlanTree = {
    id: "node-hash-join",
    nodeType: "Hash Join",
    actualStartupTimeMs: 4.82,
    actualTotalTimeMs: 18.42,
    actualRows: 420,
    planRows: 400,
    totalCost: 425.2,
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
        isProblematic: true,
        problemWarning: "Full table scan without index",
      },
    ],
  };

  const defaultProps = {
    querySql: "SELECT * FROM orders WHERE created_at >= '2026-01-01';",
    planningTimeMs: 0.85,
    executionTimeMs: 18.42,
    totalCost: 425.2,
    rootNode: samplePlanTree,
    onSelectNode: vi.fn(),
  };

  it("renders query execution plan, metrics, and operation nodes", () => {
    render(<DatabaseQueryExplainPlan {...defaultProps} />);
    expect(
      screen.getByRole("heading", {
        name: /Database Query Execution Plan & Cost Visualizer/i,
      })
    ).toBeDefined();
    expect(screen.getAllByText(/18.42 ms/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Hash Join")).toBeDefined();
    expect(screen.getByText("Seq Scan")).toBeDefined();
  });

  it("selects node and displays inspector details on click", () => {
    const handleSelect = vi.fn();
    render(<DatabaseQueryExplainPlan {...defaultProps} onSelectNode={handleSelect} />);
    const nodeBtn = screen.getByRole("button", {
      name: /Select plan node Seq Scan on orders/i,
    });
    fireEvent.click(nodeBtn);
    expect(handleSelect).toHaveBeenCalledWith("node-seq-scan");
    expect(screen.getByText("Full table scan without index")).toBeDefined();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<DatabaseQueryExplainPlan {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
