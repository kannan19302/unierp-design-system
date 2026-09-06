import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ResourceCapacityHeatmap, ResourceRow } from "./resource-capacity-heatmap";

const TEST_PERIODS = [
  { key: "p1", label: "Sprint 1" },
  { key: "p2", label: "Sprint 2" },
];

const TEST_RESOURCES: ResourceRow[] = [
  {
    id: "r1",
    name: "Alex Smith",
    role: "Staff Engineer",
    cells: [
      {
        periodKey: "p1",
        allocatedHours: 35,
        capacityHours: 40,
        tasks: [{ id: "t1", title: "API Gateway Refactor", project: "Backend", hours: 35 }],
      },
      { periodKey: "p2", allocatedHours: 50, capacityHours: 40 },
    ],
  },
];

describe("ResourceCapacityHeatmap", () => {
  it("renders team members, heatmap cells, and has zero accessibility violations", async () => {
    const { container } = render(
      <ResourceCapacityHeatmap
        title="Squad Workload"
        periods={TEST_PERIODS}
        resources={TEST_RESOURCES}
      />
    );

    expect(screen.getByText("Squad Workload")).toBeInTheDocument();
    expect(screen.getByText("Alex Smith")).toBeInTheDocument();
    expect(screen.getByText("Sprint 1")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("handles cell selection and renders drilldown tasks", () => {
    const handleSelect = vi.fn();
    render(
      <ResourceCapacityHeatmap
        periods={TEST_PERIODS}
        resources={TEST_RESOURCES}
        onSelectCell={handleSelect}
      />
    );

    const cellBtn = screen.getByRole("button", {
      name: /Alex Smith on Sprint 1: 35 of 40 hours/i,
    });
    fireEvent.click(cellBtn);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "r1" }),
      expect.objectContaining({ periodKey: "p1", allocatedHours: 35 })
    );

    expect(screen.getByText("API Gateway Refactor")).toBeInTheDocument();
    expect(screen.getByText("35h")).toBeInTheDocument();
  });
});
