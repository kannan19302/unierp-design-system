import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  ServiceHealthKpiGrid,
  type ServiceHealthKpiItem,
} from "./service-health-kpi-grid";

describe("ServiceHealthKpiGrid Component", () => {
  const sampleMetrics: ServiceHealthKpiItem[] = [
    {
      id: "uptime",
      title: "System Availability",
      value: "99.99%",
      target: "SLA: > 99.95%",
      status: "healthy",
      progressPercent: 99.99,
    },
  ];

  it("renders metric cards with title, value, and target", () => {
    render(<ServiceHealthKpiGrid metrics={sampleMetrics} />);

    expect(screen.getByText("System Availability")).toBeInTheDocument();
    expect(screen.getByText("99.99%")).toBeInTheDocument();
    expect(screen.getByText("SLA: > 99.95%")).toBeInTheDocument();
  });

  it("forwards ref to outer container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<ServiceHealthKpiGrid ref={ref} metrics={sampleMetrics} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ServiceHealthKpiGrid metrics={sampleMetrics} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
