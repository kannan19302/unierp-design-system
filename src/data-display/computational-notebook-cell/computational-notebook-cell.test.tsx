import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ComputationalNotebookCell } from "./computational-notebook-cell";

describe("ComputationalNotebookCell", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <ComputationalNotebookCell
        cellId="cmd_01"
        language="sql"
        initialCode="SELECT * FROM accounts;"
        outputData={{
          columns: ["id", "name"],
          rows: [["acc_1", "Stripe"]],
        }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders cell header, language badge, and initial code", () => {
    render(
      <ComputationalNotebookCell
        cellId="cmd_01"
        language="sql"
        initialCode="SELECT 1;"
        metrics={{ executionTimeMs: 45, memoryUsedMb: 32 }}
      />
    );
    expect(screen.getByText("Notebook Computational Cell")).toBeInTheDocument();
    expect(screen.getByText("[cmd_01] SQL")).toBeInTheDocument();
    expect(screen.getByText("45ms")).toBeInTheDocument();
    expect(screen.getByText("32MB")).toBeInTheDocument();
  });

  it("executes code and calls onExecute callback", () => {
    const handleExecute = vi.fn();
    render(
      <ComputationalNotebookCell
        cellId="cmd_01"
        initialCode="SELECT * FROM users;"
        onExecute={handleExecute}
      />
    );

    const runBtn = screen.getByRole("button", { name: /run cell/i });
    fireEvent.click(runBtn);

    expect(handleExecute).toHaveBeenCalledWith("SELECT * FROM users;");
  });

  it("toggles output visibility", () => {
    render(
      <ComputationalNotebookCell
        cellId="cmd_01"
        initialCode="SELECT 1;"
        outputData={{
          columns: ["val"],
          rows: [[1]],
        }}
      />
    );

    expect(screen.getByText("Hide Output ▼")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();

    const toggleBtn = screen.getByRole("button", { name: /hide output pane/i });
    fireEvent.click(toggleBtn);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText("Show Output ▲")).toBeInTheDocument();
  });
});
