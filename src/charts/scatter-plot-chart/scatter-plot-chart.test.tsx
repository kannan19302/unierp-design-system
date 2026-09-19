import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ScatterPlotChart } from "./scatter-plot-chart";

const SAMPLE_POINTS = [
  { x: 10, y: 15, label: "Point 1" },
];

describe("ScatterPlotChart", () => {
  it("renders without crashing", () => {
    render(<ScatterPlotChart data={SAMPLE_POINTS} />);
    expect(screen.getByRole("img", { name: /scatter plot chart/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ScatterPlotChart ref={ref} data={SAMPLE_POINTS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ScatterPlotChart data={SAMPLE_POINTS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
