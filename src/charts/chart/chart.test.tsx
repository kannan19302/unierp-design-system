import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  Charts,
  KPICard,
  MiniBarChart,
  MiniDonutChart,
  Sparkline,
  GaugeChart,
  FunnelChart,
  LineChart,
  AreaChart,
  HeatmapChart,
  ChartAccessibleWrapper,
} from "./chart";

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
        <LineChart data={[10, 20, 30]} />
        <AreaChart data={[10, 20, 30]} />
        <HeatmapChart matrix={[[1, 2], [3, 4]]} />
        <KPICard title="Total Sales" value="$42,000" />
      </div>
    );

    expect(screen.getByText("Q1")).toBeInTheDocument();
    expect(screen.getByText("Q2")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Visits")).toBeInTheDocument();
    expect(screen.getByText("Signups")).toBeInTheDocument();
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
  });

  it("forwards ref to root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Charts ref={ref}><div>Content</div></Charts>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(
      <Charts>
        <KPICard title="Revenue" value="$10,000" />
        <MiniBarChart data={[{ label: "A", value: 10 }]} />
        <MiniDonutChart segments={[{ label: "A", value: 10, color: "red" }]} />
        <Sparkline data={[5, 10, 15]} />
        <GaugeChart value={50} />
        <FunnelChart stages={[{ label: "A", value: 10 }]} />
        <LineChart data={[1, 2, 3]} />
        <AreaChart data={[1, 2, 3]} />
        <HeatmapChart matrix={[[1]]} />
      </Charts>
    );

    expect(container.querySelector('[data-slot="chart-container"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-kpi-card"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-mini-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-mini-donut"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-sparkline"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-gauge"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-funnel"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-line"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-area"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="chart-heatmap"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <Charts density={density}>
          <KPICard title="Test" value="100" />
        </Charts>
      );
      const root = container.querySelector('[data-slot="chart-container"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
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
