import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  MultiCalendarAvailabilityScheduler,
  CalendarResource,
  ScheduledBooking,
} from "./multi-calendar-availability-scheduler";

const sampleResources: CalendarResource[] = [
  {
    id: "res-1",
    name: "Elena Rostova",
    role: "Principal Enterprise Architect",
    type: "person",
  },
  {
    id: "res-2",
    name: "Marcus Vance",
    role: "VP of Cloud",
    type: "person",
  },
];

const sampleBookings: ScheduledBooking[] = [
  {
    id: "b-1",
    resourceId: "res-1",
    title: "Strata DL 2.0 Review",
    startTime: "09:00",
    endTime: "10:30",
  },
];

describe("MultiCalendarAvailabilityScheduler", () => {
  it("renders resources, time slots, and bookings", () => {
    render(
      <MultiCalendarAvailabilityScheduler
        selectedDate="2026-09-15"
        resources={sampleResources}
        bookings={sampleBookings}
      />
    );

    expect(screen.getByText("Multi-Resource Schedule Matrix: 2026-09-15")).toBeDefined();
    expect(screen.getAllByText("Elena Rostova").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Marcus Vance").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Strata DL 2.0 Review")).toBeDefined();
  });

  it("triggers slot selection when empty slot is clicked", () => {
    const handleSlotSelect = vi.fn();

    render(
      <MultiCalendarAvailabilityScheduler
        selectedDate="2026-09-15"
        resources={sampleResources}
        bookings={sampleBookings}
        onSelectSlot={handleSlotSelect}
      />
    );

    const slotBtn = screen.getByRole("button", {
      name: /Available slot at 10:00 for Elena Rostova/i,
    });
    fireEvent.click(slotBtn);

    expect(handleSlotSelect).toHaveBeenCalledWith("res-1", "10:00");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <MultiCalendarAvailabilityScheduler
        selectedDate="2026-09-15"
        resources={sampleResources}
        bookings={sampleBookings}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
