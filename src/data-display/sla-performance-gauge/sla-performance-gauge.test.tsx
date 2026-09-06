import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { SlaPerformanceGauge, type SlaMilestone } from "./sla-performance-gauge";

const testMilestones: SlaMilestone[] = [
  {
    id: "sla-1",
    name: "First Response Target",
    type: "first_response",
    targetMinutes: 15,
    elapsedMinutes: 5,
    status: "achieved",
  },
  {
    id: "sla-2",
    name: "Resolution SLA",
    type: "resolution",
    targetMinutes: 120,
    elapsedMinutes: 40,
    status: "on_track",
    penaltyAmount: 1000,
  },
];

describe("SlaPerformanceGauge", () => {
  it("renders SLA commitment tier and milestones correctly", () => {
    render(
      <SlaPerformanceGauge
        ticketRef="INC-88912"
        commitmentTier="Mission-Critical Tier 1"
        milestones={testMilestones}
      />
    );

    expect(screen.getByText("INC-88912")).toBeInTheDocument();
    expect(screen.getByText("Mission-Critical Tier 1")).toBeInTheDocument();
    expect(screen.getByText("First Response Target")).toBeInTheDocument();
    expect(screen.getAllByText("Resolution SLA").length).toBeGreaterThanOrEqual(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SlaPerformanceGauge
        ticketRef="INC-88912"
        milestones={testMilestones}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
