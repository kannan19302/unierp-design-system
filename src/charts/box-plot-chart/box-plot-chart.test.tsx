import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BoxPlotChart } from "./box-plot-chart";

const SAMPLE_DATA = [
  { label: "Q1", min: 20, q1: 35, median: 50, q3: 65, max: 80, outliers: [10, 92] },
  { label: "Q2", min: 25, q1: 40, median: 55, q3: 70, max: 85 },
  { label: "Q3", min: 30, q1: 45, median: 58, q3: 72, max: 90, outliers: [15] },
  { label: "Q4", min: 22, q1: 38, median: 52, q3: 68, max: 88 },
];

describe("BoxPlotChart", () => {
  it("renders without crashing", () => {
    render(<BoxPlotChart data={SAMPLE_DATA} />);
    expect(screen.getByRole("img", { name: /box plot chart/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<BoxPlotChart ref={ref} data={SAMPLE_DATA} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BoxPlotChart data={SAMPLE_DATA} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
