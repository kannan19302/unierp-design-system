import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { StackedBarChart } from "./stacked-bar-chart";

const SAMPLE_CATEGORIES = ["Q1", "Q2"];
const SAMPLE_SERIES = [
  { label: "Hardware", values: [40, 55], color: "var(--color-brand)" },
];

describe("StackedBarChart", () => {
  it("renders without crashing", () => {
    render(
      <StackedBarChart
        categories={SAMPLE_CATEGORIES}
        series={SAMPLE_SERIES}
      />
    );
    expect(
      screen.getByRole("img", { name: /stacked bar chart/i })
    ).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <StackedBarChart
        ref={ref}
        categories={SAMPLE_CATEGORIES}
        series={SAMPLE_SERIES}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StackedBarChart
        categories={SAMPLE_CATEGORIES}
        series={SAMPLE_SERIES}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
