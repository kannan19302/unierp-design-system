import React, { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  GanttMilestoneScheduler,
  GanttChart,
  GanttTask,
  ganttChartVariants,
} from "./gantt-chart";

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

describe("GanttMilestoneScheduler / GanttChart Component", () => {
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

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLElement>();
    render(<GanttMilestoneScheduler ref={ref} tasks={sampleTasks} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute("data-slot", "gantt-chart");
  });

  it("renders data-slot annotations on anatomy", () => {
    const { container } = render(
      <GanttMilestoneScheduler tasks={sampleTasks} />
    );
    expect(container.querySelector('[data-slot="gantt-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="gantt-chart-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="gantt-chart-grid"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="gantt-chart-wbs-pane"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="gantt-chart-timeline-pane"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="gantt-chart-bars"]')).toBeInTheDocument();
  });

  it("supports strict 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <GanttMilestoneScheduler tasks={sampleTasks} density={density} />
      );
      const root = container.querySelector('[data-slot="gantt-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });

    const classes = ganttChartVariants({ density: "ultra-compact" });
    expect(classes).toContain("densityUltraCompact");
  });

  it("aliases GanttChart to GanttMilestoneScheduler", () => {
    expect(GanttChart).toBe(GanttMilestoneScheduler);
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
