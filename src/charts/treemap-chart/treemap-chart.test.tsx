import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { TreemapChart } from "./treemap-chart";

const SAMPLE_NODES = [
  { label: "Engineering", value: 450 },
  { label: "Sales", value: 250 },
];

describe("TreemapChart", () => {
  it("renders without crashing and displays nodes", () => {
    render(<TreemapChart data={SAMPLE_NODES} />);
    expect(screen.getByRole("img", { name: /treemap chart/i })).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<TreemapChart ref={ref} data={SAMPLE_NODES} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <TreemapChart data={SAMPLE_NODES} />
    );
    expect(container.querySelector('[data-slot="treemap-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="treemap-chart-grid"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="treemap-chart-cell"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="treemap-chart-cell-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="treemap-chart-cell-value"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <TreemapChart
          density={density}
          data={SAMPLE_NODES}
        />
      );
      const root = container.querySelector('[data-slot="treemap-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <TreemapChart data={SAMPLE_NODES} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
