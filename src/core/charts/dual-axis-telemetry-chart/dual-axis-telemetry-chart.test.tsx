import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  DualAxisTelemetryChart,
  type TelemetryDataPoint,
} from "./dual-axis-telemetry-chart";

describe("DualAxisTelemetryChart Component", () => {
  const sampleData: TelemetryDataPoint[] = [
    { time: "10:00", successRate: 99.9, latencyMs: 25 },
    { time: "10:15", successRate: 99.8, latencyMs: 30 },
  ];

  it("renders SVG chart elements and data table fallback", () => {
    render(
      <DualAxisTelemetryChart
        data={sampleData}
        title="Telemetry Test"
      />
    );

    expect(screen.getByRole("heading", { name: "Telemetry Test" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Time series telemetry graph/ })).toBeInTheDocument();

    // Check accessible fallback table
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("99.9%")).toBeInTheDocument();
    expect(screen.getByText("25ms")).toBeInTheDocument();
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<DualAxisTelemetryChart ref={ref} data={sampleData} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DualAxisTelemetryChart data={sampleData} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
