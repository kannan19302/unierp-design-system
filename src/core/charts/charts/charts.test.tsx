import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  Charts,
  MiniBarChart,
  MiniDonutChart,
  Sparkline,
  GaugeChart,
  FunnelChart,
  ChartAccessibleWrapper,
} from "./charts";

describe("Charts Primitive Suite", () => {
  it("renders BarChart, Donut, and Sparkline primitives", () => {
    render(
      <div>
        <MiniBarChart
          data={[
            { label: "Q1", value: 100 },
            { label: "Q2", value: 150 },
          ]}
        />
        <MiniDonutChart
          segments={[
            { label: "S1", value: 60, color: "var(--color-brand)" },
            { label: "S2", value: 40, color: "var(--color-success)" },
          ]}
          centerValue="100%"
        />
        <Sparkline data={[10, 20, 15, 25, 30]} />
        <GaugeChart value={75} />
        <FunnelChart
          stages={[
            { label: "Visits", value: 1000 },
            { label: "Signups", value: 300 },
          ]}
        />
      </div>
    );

    expect(screen.getByText("Q1")).toBeInTheDocument();
    expect(screen.getByText("Q2")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Visits")).toBeInTheDocument();
    expect(screen.getByText("Signups")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Charts ref={ref}><div>Content</div></Charts>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations with ChartAccessibleWrapper", async () => {
    const { container } = render(
      <ChartAccessibleWrapper
        label="Quarterly revenue breakdown"
        tableData={{
          columns: ["Quarter", "Revenue"],
          rows: [
            ["Q1", "$100K"],
            ["Q2", "$150K"],
          ],
        }}
      >
        <MiniBarChart
          data={[
            { label: "Q1", value: 100 },
            { label: "Q2", value: 150 },
          ]}
        />
      </ChartAccessibleWrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
