import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  FunnelDropoffAnalyzer,
  FunnelChart,
  type FunnelStep,
} from "./funnel-chart";

const mockSteps: FunnelStep[] = [
  {
    id: "step-1",
    stepNumber: 1,
    name: "Landing Page View",
    eventKey: "page_view_home",
    count: 10000,
    overallConversionPct: 100.0,
    stepConversionPct: 100.0,
    dropoffCount: 6000,
    dropoffPct: 60.0,
    medianTimeToConvert: "2m",
  },
  {
    id: "step-2",
    stepNumber: 2,
    name: "Free Trial Sign Up",
    eventKey: "auth_signup",
    count: 4000,
    overallConversionPct: 40.0,
    stepConversionPct: 40.0,
    dropoffCount: 0,
    dropoffPct: 0.0,
  },
];

describe("FunnelDropoffAnalyzer & FunnelChart", () => {
  it("forwards ref to container element", () => {
    const ref = React.createRef<HTMLElement>();
    render(<FunnelDropoffAnalyzer ref={ref} steps={mockSteps} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("renders steps and conversion statistics", () => {
    render(<FunnelDropoffAnalyzer steps={mockSteps} />);
    expect(
      screen.getByText("Enterprise Customer Acquisition Funnel")
    ).toBeInTheDocument();
    expect(screen.getAllByText("Landing Page View").length).toBeGreaterThan(0);
    expect(screen.getByText("Free Trial Sign Up")).toBeInTheDocument();
    expect(screen.getByText("10,000 users")).toBeInTheDocument();
    expect(screen.getByText("4,000 users")).toBeInTheDocument();
  });

  it("handles step selection to inspect dropoff bottleneck", () => {
    const onSelect = vi.fn();
    render(<FunnelDropoffAnalyzer steps={mockSteps} onStepSelect={onSelect} />);

    const stepBtn = screen.getByRole("button", { name: "Free Trial Sign Up" });
    fireEvent.click(stepBtn);
    expect(onSelect).toHaveBeenCalledWith("step-2");
  });

  it("handles segment filter changes", () => {
    const onSegmentChange = vi.fn();
    render(
      <FunnelDropoffAnalyzer
        steps={mockSteps}
        onSegmentChange={onSegmentChange}
      />
    );

    const select = screen.getByRole("combobox", { name: /Cohort Segment:/i });
    fireEvent.change(select, { target: { value: "Organic Search" } });
    expect(onSegmentChange).toHaveBeenCalledWith("Organic Search");
  });

  it("renders with data-slot attributes", () => {
    const { container } = render(<FunnelDropoffAnalyzer steps={mockSteps} />);
    expect(container.querySelector('[data-slot="funnel-chart"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="funnel-chart-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="funnel-chart-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="funnel-chart-segment-select"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="funnel-chart-flow"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-slot="funnel-chart-step"]').length).toBe(2);
    expect(container.querySelector('[data-slot="funnel-chart-connector"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="funnel-chart-diagnostics"]')).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const densities = ["ultra-compact", "compact", "standard", "comfortable"] as const;
    densities.forEach((density) => {
      const { container, unmount } = render(
        <FunnelDropoffAnalyzer density={density} steps={mockSteps} />
      );
      const root = container.querySelector('[data-slot="funnel-chart"]');
      expect(root).toHaveAttribute("data-density", density);
      unmount();
    });
  });

  it("works with FunnelChart alias", () => {
    render(<FunnelChart steps={mockSteps} funnelName="Alias Funnel" />);
    expect(screen.getByText("Alias Funnel")).toBeInTheDocument();
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(<FunnelDropoffAnalyzer steps={mockSteps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
