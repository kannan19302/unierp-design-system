import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  StatisticalProcessControlChart,
  SpcSubgroupSample,
} from "./statistical-process-control-chart";

const sampleSubgroups: SpcSubgroupSample[] = [
  {
    sampleIndex: 1,
    timestamp: "08:00",
    meanValue: 85.002,
    rangeValue: 0.012,
    isViolation: false,
  },
  {
    sampleIndex: 2,
    timestamp: "08:30",
    meanValue: 85.048,
    rangeValue: 0.024,
    isViolation: true,
    violationRule: "Rule 1: Exceeds UCL",
  },
];

describe("StatisticalProcessControlChart", () => {
  it("renders process header and statistical parameters truthfully", () => {
    render(
      <StatisticalProcessControlChart
        processName="Cylinder Bore Diameter Machining"
        subgroups={sampleSubgroups}
      />
    );
    expect(
      screen.getByText("Cylinder Bore Diameter Machining")
    ).toBeInTheDocument();
    expect(screen.getByText("1 Special Cause Violations")).toBeInTheDocument();
    expect(screen.getByText("2 Subgroups Sampled")).toBeInTheDocument();
    expect(screen.getByText("Rule 1: Exceeds UCL")).toBeInTheDocument();
  });

  it("handles clicking on a subgroup sample to inspect", () => {
    const handleInspect = vi.fn();
    render(
      <StatisticalProcessControlChart
        subgroups={sampleSubgroups}
        onInspectSample={handleInspect}
      />
    );

    const row = screen.getByText("#2");
    fireEvent.click(row);
    expect(handleInspect).toHaveBeenCalledWith(2);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <StatisticalProcessControlChart subgroups={sampleSubgroups} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
