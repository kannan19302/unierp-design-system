import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { InpatientBedBoard, type InpatientBed } from "./inpatient-bed-board";

const testBeds: InpatientBed[] = [
  {
    id: "bed-1",
    roomNumber: "Room 401-A",
    wardName: "Cardiology",
    occupancyState: "occupied",
    patientInitials: "E.V.",
    patientAge: 68,
    attendingPhysician: "Dr. Thorne",
    isolation: "none",
  },
  {
    id: "bed-2",
    roomNumber: "Room 402-A",
    wardName: "Cardiology",
    occupancyState: "clean_ready",
    isolation: "none",
  },
];

describe("InpatientBedBoard", () => {
  it("renders ward title and bed room numbers correctly", () => {
    render(
      <InpatientBedBoard
        wardTitle="Inpatient Ward 4A"
        facilityName="City Memorial Hospital"
        beds={testBeds}
      />
    );

    expect(screen.getByText("Inpatient Ward 4A")).toBeInTheDocument();
    expect(screen.getByText("City Memorial Hospital")).toBeInTheDocument();
    expect(screen.getAllByText("Room 401-A").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Room 402-A")).toBeInTheDocument();
  });

  it("filters beds when clicking state filter pills", () => {
    render(
      <InpatientBedBoard
        wardTitle="Inpatient Ward 4A"
        beds={testBeds}
      />
    );

    const readyBtn = screen.getByRole("button", { name: /Ready \(/i });
    fireEvent.click(readyBtn);

    expect(screen.getByText("Room 402-A")).toBeInTheDocument();
    expect(screen.queryByText("Room 401-A")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <InpatientBedBoard
        wardTitle="Inpatient Ward 4A"
        beds={testBeds}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
