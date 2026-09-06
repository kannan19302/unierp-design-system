import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PeriodCloseCockpit } from "./period-close-cockpit";
import type { CloseTask } from "./period-close-cockpit";

const mockTasks: CloseTask[] = [
  {
    id: "task-1",
    title: "AP Invoicing Lock",
    category: "Subledger AP/AR",
    owner: "Elena",
    dueDate: "2026-09-01",
    status: "completed",
  },
  {
    id: "task-2",
    title: "Bank Reconciliation",
    category: "Reconciliation & Tax",
    owner: "Sarah",
    dueDate: "2026-09-02",
    status: "in-progress",
    prerequisiteTaskIds: ["task-1"],
    exceptionCount: 1,
  },
  {
    id: "task-3",
    title: "GL Hard Lock",
    category: "Consolidation & GL",
    owner: "Alex",
    dueDate: "2026-09-03",
    status: "pending",
    prerequisiteTaskIds: ["task-2"],
  },
];

describe("PeriodCloseCockpit", () => {
  it("renders fiscal period and tasks", () => {
    render(
      <PeriodCloseCockpit
        fiscalPeriod="FY2026-Q3 Close"
        tasks={mockTasks}
      />
    );

    expect(screen.getByText("FY2026-Q3 Close")).toBeInTheDocument();
    expect(screen.getByText("AP Invoicing Lock")).toBeInTheDocument();
    expect(screen.getByText("Bank Reconciliation")).toBeInTheDocument();
    expect(screen.getByText("GL Hard Lock")).toBeInTheDocument();
    expect(screen.getByText("1 of 3 Tasks Complete (33%)")).toBeInTheDocument();
  });

  it("filters tasks by category tab", () => {
    render(
      <PeriodCloseCockpit
        fiscalPeriod="FY2026-Q3 Close"
        tasks={mockTasks}
      />
    );

    const apTab = screen.getByRole("button", { name: "Subledger AP/AR" });
    fireEvent.click(apTab);

    expect(screen.getByText("AP Invoicing Lock")).toBeInTheDocument();
    expect(screen.queryByText("Bank Reconciliation")).not.toBeInTheDocument();
  });

  it("updates task completion status on checkbox toggle", () => {
    const onStatusChange = vi.fn();
    render(
      <PeriodCloseCockpit
        fiscalPeriod="FY2026-Q3 Close"
        tasks={mockTasks}
        onTaskStatusChange={onStatusChange}
      />
    );

    const checkbox = screen.getByLabelText(/Mark task AP Invoicing Lock as completed/i);
    fireEvent.click(checkbox);

    expect(onStatusChange).toHaveBeenCalledWith("task-1", "in-progress");
  });

  it("enables and executes hard lock when all tasks are complete", () => {
    const onExecuteHardLock = vi.fn();
    const completedTasks: CloseTask[] = mockTasks.map((t) => ({ ...t, status: "completed" }));

    render(
      <PeriodCloseCockpit
        fiscalPeriod="FY2026-Q3 Close"
        tasks={completedTasks}
        onExecuteHardLock={onExecuteHardLock}
      />
    );

    const hardLockBtn = screen.getByRole("button", { name: /Finalize & Hard Lock GL/i });
    expect(hardLockBtn).not.toBeDisabled();

    fireEvent.click(hardLockBtn);
    expect(onExecuteHardLock).toHaveBeenCalledTimes(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PeriodCloseCockpit
        fiscalPeriod="FY2026-Q3 Close"
        tasks={mockTasks}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
