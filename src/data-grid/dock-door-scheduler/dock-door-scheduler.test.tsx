import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DockDoorScheduler, type DockAppointment } from "./dock-door-scheduler";

const testAppointments: DockAppointment[] = [
  {
    id: "appt-1",
    doorNumber: "Door 01",
    timeSlot: "08:00",
    carrierName: "J.B. Hunt Transport",
    trailerId: "TR-8819",
    purchaseOrder: "PO-2026-9901",
    palletCount: 26,
    status: "docked_unloading",
    detentionRiskMinutes: 45,
  },
  {
    id: "appt-2",
    doorNumber: "Door 02",
    timeSlot: "08:00",
    carrierName: "Swift Transportation",
    trailerId: "TR-1049",
    purchaseOrder: "PO-2026-9877",
    palletCount: 22,
    status: "completed",
  },
];

describe("DockDoorScheduler", () => {
  it("renders facility title and appointment matrix correctly", () => {
    render(
      <DockDoorScheduler
        facilityTitle="Northwest Inbound Terminal"
        appointments={testAppointments}
      />
    );

    expect(screen.getByText("Northwest Inbound Terminal")).toBeInTheDocument();
    expect(screen.getAllByText("J.B. Hunt Transport").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Swift Transportation").length).toBeGreaterThanOrEqual(1);
  });

  it("selects an appointment slot and fires callback", () => {
    const onSelect = vi.fn();
    render(
      <DockDoorScheduler
        appointments={testAppointments}
        onSelectAppointment={onSelect}
      />
    );

    const cards = screen.getAllByRole("button");
    fireEvent.click(cards[1]);

    expect(onSelect).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DockDoorScheduler
        facilityTitle="Northwest Inbound Terminal"
        appointments={testAppointments}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
