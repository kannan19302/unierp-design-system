import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { RealTimeMetricsBoard } from "./real-time-metrics-board";

const SAMPLE_WIDGETS = [
  { id: "1", label: "CPU Usage", value: "67%", status: "normal" as const },
  { id: "2", label: "Memory", value: "82%", status: "warning" as const },
  { id: "3", label: "Requests/s", value: "1,247", unit: "req/s" },
];

describe("RealTimeMetricsBoard", () => {
  it("renders without crashing and displays widgets", () => {
    render(<RealTimeMetricsBoard title="Live Cluster" widgets={SAMPLE_WIDGETS} />);
    expect(screen.getByText("Live Cluster")).toBeInTheDocument();
    expect(screen.getByText("CPU Usage")).toBeInTheDocument();
    expect(screen.getByText("67%")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<RealTimeMetricsBoard ref={ref} widgets={SAMPLE_WIDGETS} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <RealTimeMetricsBoard widgets={SAMPLE_WIDGETS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
