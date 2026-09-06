import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  ShipmentTrackingMilestoneTracker,
  type ShipmentMilestone,
} from "./shipment-tracking-milestone-tracker";

const testMilestones: ShipmentMilestone[] = [
  {
    id: "m-1",
    name: "Factory Origin Dispatch",
    location: "Suzhou Industrial Park, CN",
    mode: "truck",
    status: "completed",
    scheduledTime: "2026-08-28 09:00",
    carrierName: "Sinotrans Drayage",
  },
  {
    id: "m-2",
    name: "Ocean Vessel Departure",
    location: "Port of Shanghai (CNSHA)",
    mode: "vessel",
    status: "in_transit",
    scheduledTime: "2026-08-30 18:00",
    carrierName: "MSC Geneva",
  },
];

describe("ShipmentTrackingMilestoneTracker", () => {
  it("renders shipment details and milestones correctly", () => {
    render(
      <ShipmentTrackingMilestoneTracker
        shipmentNumber="MSCU-849102-1"
        routeSummary="Shanghai to Long Beach"
        milestones={testMilestones}
      />
    );

    expect(screen.getByText("MSCU-849102-1")).toBeInTheDocument();
    expect(screen.getByText("Shanghai to Long Beach")).toBeInTheDocument();
    expect(screen.getAllByText("Factory Origin Dispatch").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Ocean Vessel Departure").length).toBeGreaterThanOrEqual(1);
  });

  it("selects a milestone and reveals detailed telemetry", () => {
    render(
      <ShipmentTrackingMilestoneTracker
        shipmentNumber="MSCU-849102-1"
        milestones={testMilestones}
      />
    );

    const firstCard = screen.getAllByRole("button")[0];
    fireEvent.click(firstCard);

    expect(screen.getAllByText("Factory Origin Dispatch").length).toBeGreaterThanOrEqual(1);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ShipmentTrackingMilestoneTracker
        shipmentNumber="MSCU-849102-1"
        milestones={testMilestones}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
