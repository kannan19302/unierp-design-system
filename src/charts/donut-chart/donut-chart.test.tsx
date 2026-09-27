import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { DonutChart } from "./donut-chart";

describe("DonutChart", () => {
  it("renders SVG circle segments and center text", () => {
    const { container } = render(<DonutChart centerValue="85%" centerLabel="Completion" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("Completion")).toBeInTheDocument();
  });

  it("forwards ref to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DonutChart ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "figure");
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(<DonutChart centerValue="100" centerLabel="Total" />);
    expect(container.querySelector('[data-slot="donut-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="donut-chart-svg"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="donut-chart-segment"]').length).toBe(3);
    expect(container.querySelector('[data-slot="donut-chart-center"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="donut-chart-center-value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="donut-chart-center-label"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(<DonutChart density={density} />);
      const root = container.querySelector('[data-slot="donut-chart"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<DonutChart centerValue="85%" centerLabel="Completion Rate" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
