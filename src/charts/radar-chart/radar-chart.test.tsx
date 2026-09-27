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
  it("renders without crashing", () => {
    render(<RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />);
    expect(screen.getByRole("img", { name: /radar chart/i })).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<RadarChart ref={ref} axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RadarChart axes={SAMPLE_AXES} datasets={SAMPLE_DATASETS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
