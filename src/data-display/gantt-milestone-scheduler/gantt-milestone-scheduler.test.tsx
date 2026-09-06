import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  GanttMilestoneScheduler,
  GanttTask,
} from "./gantt-milestone-scheduler";

const sampleTasks: GanttTask[] = [
  {
    id: "task-1",
    name: "Architectural RFC",
    assignee: "Sarah Chen",
    startDate: "2026-10-01",
    endDate: "2026-10-06",
    startDayOffset: 0,
    durationDays: 6,
    progressPercent: 100,
    isCriticalPath: true,
  },
  {
    id: "task-2",
    name: "Milestone Alpha Sign-off",
    assignee: "Board",
    startDate: "2026-10-22",
    endDate: "2026-10-22",
    startDayOffset: 21,
    durationDays: 1,
    progressPercent: 0,
    isMilestone: true,
    isCriticalPath: false,
  },
];

describe("GanttMilestoneScheduler", () => {
  it("renders project title, WBS tasks and timeline bars", () => {
    render(
      <GanttMilestoneScheduler
        projectTitle="Project Hyperion"
        tasks={sampleTasks}
      />
    );

    expect(screen.getByText("Project Hyperion")).toBeInTheDocument();
    expect(screen.getAllByText("Architectural RFC").length).toBeGreaterThan(0);
    expect(screen.getByText("Sarah Chen")).toBeInTheDocument();
    expect(screen.getByText("Milestone Alpha Sign-off")).toBeInTheDocument();
  });

  it("filters to critical path only", () => {
    render(
      <GanttMilestoneScheduler
        tasks={sampleTasks}
      />
    );

    const filterBtn = screen.getByRole("button", { name: /Show All Tasks/i });
    expect(screen.getAllByText("Architectural RFC").length).toBeGreaterThan(0);
    expect(screen.getByText("Milestone Alpha Sign-off")).toBeInTheDocument();

    fireEvent.click(filterBtn);
    expect(screen.getAllByText("Architectural RFC").length).toBeGreaterThan(0);
    expect(screen.queryByText("Milestone Alpha Sign-off")).not.toBeInTheDocument();
  });


  it("has zero accessibility violations", async () => {
    const { container } = render(
      <GanttMilestoneScheduler
        tasks={sampleTasks}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
