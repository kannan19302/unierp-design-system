import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RadarChart } from "./radar-chart";

const SAMPLE_AXES = ["Speed", "Reliability", "Comfort"];
const SAMPLE_DATASETS = [
  { label: "Alpha", values: [80, 90, 70] },
];

describe("RadarChart", () => {
  it("renders without crashing and displays legend", () => {
    render(<RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />);
    expect(screen.getByRole("img", { name: /radar chart/i })).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadarChart ref={ref} axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("exposes data-slot anatomy attributes", () => {
    const { container } = render(
      <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />
    );
    expect(container.querySelector('[data-slot="radar-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="radar-chart-svg"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="radar-chart-legend"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="radar-chart-legend-item"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="radar-chart-legend-dot"]')).toBeInTheDocument();
  });

  it("renders 4 density scaling tiers properly", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container } = render(
        <RadarChart
          density={density}
          axes={SAMPLE_AXES}
          datasets={SAMPLE_DATASETS}
        />
      );
      const root = container.querySelector('[data-slot="radar-chart"]');
      expect(root).toHaveAttribute("data-density", density);
    });
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
