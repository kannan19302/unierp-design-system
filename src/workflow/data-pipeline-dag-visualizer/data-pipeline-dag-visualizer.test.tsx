import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { DataPipelineDagVisualizer } from "./data-pipeline-dag-visualizer";

describe("DataPipelineDagVisualizer", () => {
  const sampleTasks = [
    {
      id: "extract_bank_feed",
      name: "Extract ISO 20022 Bank Feeds",
      operator: "SftpSensor",
      status: "success" as const,
      durationSeconds: 42,
    },
    {
      id: "dbt_reconcile_ledger",
      name: "dbt Run: Ledger Reconciliation",
      operator: "dbtRunOperator",
      status: "failed" as const,
      durationSeconds: 65,
      logsPreview: ["ERROR in model: deadlock detected"],
    },
  ];

  const defaultProps = {
    dagId: "financial_reconciliation_nightly",
    pipelineName: "Global Ledger Reconciliation",
    scheduleInterval: "0 2 * * *",
    executionDate: "2026-09-06T02:00:00Z",
    tasks: sampleTasks,
    onSelectTask: vi.fn(),
    onTriggerRun: vi.fn(),
    onRetryTask: vi.fn(),
  };

  it("renders pipeline header, stats, and task nodes", () => {
    render(<DataPipelineDagVisualizer {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /Global Ledger Reconciliation/i })).toBeDefined();
    expect(screen.getByText("financial_reconciliation_nightly")).toBeDefined();
    expect(screen.getAllByText("Extract ISO 20022 Bank Feeds").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("dbt Run: Ledger Reconciliation")).toBeDefined();
  });

  it("selects task and displays execution logs on node click", () => {
    const handleSelect = vi.fn();
    render(<DataPipelineDagVisualizer {...defaultProps} onSelectTask={handleSelect} />);
    const taskBtn = screen.getByRole("button", {
      name: /Inspect task dbt Run: Ledger Reconciliation/i,
    });
    fireEvent.click(taskBtn);
    expect(handleSelect).toHaveBeenCalledWith("dbt_reconcile_ledger");
    expect(screen.getByText(/ERROR in model: deadlock detected/i)).toBeDefined();
  });

  it("triggers pipeline run when button is clicked", () => {
    const handleTrigger = vi.fn();
    render(<DataPipelineDagVisualizer {...defaultProps} onTriggerRun={handleTrigger} />);
    const triggerBtn = screen.getByRole("button", { name: /trigger pipeline run/i });
    fireEvent.click(triggerBtn);
    expect(handleTrigger).toHaveBeenCalled();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<DataPipelineDagVisualizer {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
