import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ScatterPlotChart, ScatterChart } from "./scatter-chart";

const SAMPLE_POINTS = [
  { x: 10, y: 15, label: "Point 1" },
];

describe("ScatterPlotChart / ScatterChart", () => {
  it("renders without crashing", () => {
    render(<ScatterPlotChart data={SAMPLE_POINTS} />);
    expect(screen.getByRole("img", { name: /scatter plot chart/i })).toBeInTheDocument();
  });

  it("renders via alias ScatterChart", () => {
    render(<ScatterChart data={SAMPLE_POINTS} />);
    expect(screen.getByRole("img", { name: /scatter plot chart/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScatterPlotChart ref={ref} data={SAMPLE_POINTS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <ScatterPlotChart
        data={SAMPLE_POINTS}
        xLabel="Latency"
        yLabel="Throughput"
      />
    );
    expect(container.querySelector('[data-slot="scatter-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="scatter-chart-svg"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="scatter-chart-axis"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="scatter-chart-label"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="scatter-chart-point"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <ScatterPlotChart
          density={density}
          data={SAMPLE_POINTS}
        />
      );
      const root = container.querySelector('[data-slot="scatter-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ScatterPlotChart data={SAMPLE_POINTS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
