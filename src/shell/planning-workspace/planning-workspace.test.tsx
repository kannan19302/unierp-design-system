import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { axe } from "vitest-axe";
import { PlanningWorkspace } from "./planning-workspace";

describe("PlanningWorkspace", () => {
  it("renders title, period navigation, and timeframe switcher", () => {
    const handleTimeframeChange = vi.fn();
    render(
      <PlanningWorkspace
        title="Release Plan"
        periodLabel="Q3 2026"
        onTimeframeChange={handleTimeframeChange}
        onToday={() => {}}
      >
        <div>Gantt content</div>
      </PlanningWorkspace>,
    );

    expect(screen.getByRole("heading", { name: "Release Plan" })).toBeInTheDocument();
    expect(screen.getByText("Q3 2026")).toBeInTheDocument();
    expect(screen.getByText("Gantt content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument();

    const weekBtn = screen.getByRole("button", { name: "Week" });
    fireEvent.click(weekBtn);
    expect(handleTimeframeChange).toHaveBeenCalledWith("week");
  });

  it("renders Meridian context boundary when segments are supplied", () => {
    render(
      <PlanningWorkspace
        title="Sprint Timeline"
        segments={[{ label: "Projects", href: "/projects" }, { label: "Milestone Schedule" }]}
      >
        <div>Timeline</div>
      </PlanningWorkspace>,
    );

    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Milestone Schedule")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PlanningWorkspace
        title="Sprint Planning"
        periodLabel="Sprint 44"
        segments={[{ label: "Projects", href: "/projects" }, { label: "Sprint 44" }]}
        onPrevPeriod={() => {}}
        onNextPeriod={() => {}}
        onToday={() => {}}
      >
        <div>Sprint Board Canvas</div>
      </PlanningWorkspace>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
