import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  ShiftRosterScheduler,
  EmployeeRosterEntry,
} from "./shift-roster-scheduler";

const mockEmployees: EmployeeRosterEntry[] = [
  {
    employeeId: "emp-101",
    fullName: "Marco Rossi",
    roleTitle: "Executive Chef",
    hourlyRate: 36.0,
    shifts: [
      { id: "s1", dayIndex: 0, startTime: "08:00", endTime: "16:30", hours: 8.5, role: "Chef" },
    ],
  },
];

describe("ShiftRosterScheduler", () => {
  it("renders employee roster and labor budget", () => {
    render(
      <ShiftRosterScheduler
        employees={mockEmployees}
        departmentName="Kitchen"
        laborBudget={5000}
      />
    );
    expect(
      screen.getByText("Weekly Shift Roster & Labor Budget Tracker")
    ).toBeInTheDocument();
    expect(screen.getByText("Marco Rossi")).toBeInTheDocument();
    expect(screen.getByText("Kitchen")).toBeInTheDocument();
    expect(screen.getByText("08:00 - 16:30")).toBeInTheDocument();
  });

  it("handles publish roster button click", () => {
    const onPublish = vi.fn();
    render(
      <ShiftRosterScheduler
        employees={mockEmployees}
        onPublishRoster={onPublish}
      />
    );

    const publishBtn = screen.getByRole("button", {
      name: /Publish Shift Roster/i,
    });
    fireEvent.click(publishBtn);
    expect(onPublish).toHaveBeenCalled();
  });

  it("handles assign shift button click", () => {
    const onAssign = vi.fn();
    render(
      <ShiftRosterScheduler
        employees={mockEmployees}
        onAssignShift={onAssign}
      />
    );

    const addBtns = screen.getAllByRole("button", { name: /Assign shift to Marco Rossi/i });
    fireEvent.click(addBtns[0]);
    expect(onAssign).toHaveBeenCalledWith("emp-101", expect.any(Number));
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <ShiftRosterScheduler employees={mockEmployees} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
