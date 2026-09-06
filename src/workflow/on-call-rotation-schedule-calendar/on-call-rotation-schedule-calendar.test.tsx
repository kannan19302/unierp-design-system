import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  OnCallRotationScheduleCalendar,
  EscalationLayer,
  OnCallShift,
} from "./on-call-rotation-schedule-calendar";

const sampleDays = ["Mon 9/14", "Tue 9/15"];

const sampleLayers: EscalationLayer[] = [
  {
    tier: "tier_1_primary",
    title: "Tier 1: Primary On-Call",
    escalationTimeoutMinutes: 5,
  },
];

const sampleShifts: OnCallShift[] = [
  {
    id: "shift-t1-mon",
    tier: "tier_1_primary",
    engineerName: "Elena Rostova",
    engineerEmail: "elena.rostova@unierp.internal",
    dayLabel: "Mon 9/14",
    startTime: "09:00 UTC",
    endTime: "09:00 UTC (+1d)",
    handoffNotes: "Kafka partition rebalance executed.",
  },
  {
    id: "shift-t1-tue",
    tier: "tier_1_primary",
    engineerName: "Marcus Vance",
    engineerEmail: "marcus.vance@unierp.internal",
    dayLabel: "Tue 9/15",
    startTime: "09:00 UTC",
    endTime: "09:00 UTC (+1d)",
    isOverride: true,
    originalEngineer: "Elena Rostova",
  },
];

describe("OnCallRotationScheduleCalendar", () => {
  it("renders rotation schedule title, tiers, and engineer shifts", () => {
    render(
      <OnCallRotationScheduleCalendar
        scheduleName="Platform SRE Escalation"
        weekRange="Sep 14 – Sep 20, 2026"
        days={sampleDays}
        layers={sampleLayers}
        shifts={sampleShifts}
      />
    );

    expect(screen.getByText("Platform SRE Escalation")).toBeDefined();
    expect(screen.getByText("Tier 1: Primary On-Call")).toBeDefined();
    expect(screen.getAllByText("Elena Rostova").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Marcus Vance").length).toBeGreaterThanOrEqual(1);
  });

  it("selects a shift card and updates the inspection drawer", () => {
    const handleSelect = vi.fn();

    render(
      <OnCallRotationScheduleCalendar
        scheduleName="Platform SRE Escalation"
        weekRange="Sep 14 – Sep 20, 2026"
        days={sampleDays}
        layers={sampleLayers}
        shifts={sampleShifts}
        onSelectShift={handleSelect}
      />
    );

    const marcusBtn = screen.getByRole("button", {
      name: /shift on Tue 9\/15 assigned to Marcus Vance/i,
    });
    fireEvent.click(marcusBtn);

    expect(handleSelect).toHaveBeenCalledWith(sampleShifts[1]);
    expect(screen.getByText(/Active Coverage Swap/i)).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <OnCallRotationScheduleCalendar
        scheduleName="Platform SRE Escalation"
        weekRange="Sep 14 – Sep 20, 2026"
        days={sampleDays}
        layers={sampleLayers}
        shifts={sampleShifts}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
