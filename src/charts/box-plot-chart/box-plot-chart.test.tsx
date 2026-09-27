import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BoxPlotChart } from "./box-plot-chart";

const SAMPLE_DATA = [
  { label: "Q1", min: 20, q1: 35, median: 50, q3: 65, max: 80, outliers: [10, 92] },
  { label: "Q2", min: 25, q1: 40, median: 55, q3: 70, max: 85 },
];

describe("BoxPlotChart", () => {
  it("renders without crashing and displays group labels", () => {
    render(<BoxPlotChart data={SAMPLE_DATA} />);
    expect(screen.getByRole("img", { name: /box plot chart/i })).toBeInTheDocument();
    expect(screen.getByText("Q1")).toBeInTheDocument();
    expect(screen.getByText("Q2")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BoxPlotChart ref={ref} data={SAMPLE_DATA} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes all data-slot anatomy attributes", () => {
    const { container } = render(
      <BoxPlotChart data={SAMPLE_DATA} />
    );
    expect(container.querySelector('[data-slot="box-plot-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="box-plot-chart-svg"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="box-plot-chart-group"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="box-plot-chart-whisker"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="box-plot-chart-box"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="box-plot-chart-median"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="box-plot-chart-outlier"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="box-plot-chart-label"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <BoxPlotChart
          density={density}
          data={SAMPLE_DATA}
        />
      );
      const root = container.querySelector('[data-slot="box-plot-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BoxPlotChart data={SAMPLE_DATA} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
