import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { OperationalDashboard } from "./operational-dashboard";

const MOCK_KPIS = [
  { label: "Throughput", value: "98.4%", change: 1.2 },
  { label: "Active Nodes", value: "48 / 50", change: 0 },
];

describe("OperationalDashboard Primitive", () => {
  it("renders title, KPI strip, and dashboard regions", () => {
    render(
      <OperationalDashboard
        title="Fleet Command"
        subtitle="Real-time vehicle telemetry"
        kpis={MOCK_KPIS}
        mainChart={<div>Primary Telemetry Chart</div>}
        activityTable={<div>Live Unit Positions</div>}
      />
    );

    expect(screen.getByText("Fleet Command")).toBeInTheDocument();
    expect(screen.getByText("Real-time vehicle telemetry")).toBeInTheDocument();
    expect(screen.getByText("Throughput")).toBeInTheDocument();
    expect(screen.getByText("Primary Telemetry Chart")).toBeInTheDocument();
    expect(screen.getByText("Live Unit Positions")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <OperationalDashboard
        title="Fleet Command"
        kpis={MOCK_KPIS}
        mainChart={<div>Chart</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
