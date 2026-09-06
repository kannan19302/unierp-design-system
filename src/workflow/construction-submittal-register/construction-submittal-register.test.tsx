import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  ConstructionSubmittalRegister,
  ConstructionSubmittalItem,
} from "./construction-submittal-register";

const sampleSubmittals: ConstructionSubmittalItem[] = [
  {
    id: "sub_033000_14",
    submittalNumber: "03-3000-014",
    specSection: "03 30 00 Cast-in-Place Concrete",
    title: "High-Strength Structural Concrete Mix Design C-40",
    subcontractor: "Apex Structural Pours LLC",
    reviewer: "Thornton Tomasetti Structural Engineering",
    status: "APPROVED",
    leadTimeWeeks: 4,
    requiredOnSiteDate: "2026-10-15",
    ballInCourt: "Lead Structural Engineer",
  },
  {
    id: "sub_084400_03",
    submittalNumber: "08-4400-003",
    specSection: "08 44 00 Curtain Wall & Glazing",
    title: "Triple-Glazed Unitized Façade Acoustic Performance Data",
    subcontractor: "Permasteelisa North America",
    reviewer: "Enclos Façade Consultants",
    status: "OVERDUE",
    leadTimeWeeks: 12,
    requiredOnSiteDate: "2026-09-15",
    ballInCourt: "Principal Architect",
  },
];

describe("ConstructionSubmittalRegister", () => {
  it("renders submittal items and project header truthfully", () => {
    render(
      <ConstructionSubmittalRegister
        submittals={sampleSubmittals}
        projectName="Hudson Yards Tower IV"
      />
    );
    expect(screen.getByText(/Master Construction Submittal Register/i)).toBeInTheDocument();
    expect(screen.getByText("Hudson Yards Tower IV")).toBeInTheDocument();
    expect(screen.getByText("03-3000-014")).toBeInTheDocument();
    expect(screen.getByText("Apex Structural Pours LLC")).toBeInTheDocument();
    expect(screen.getByText("Permasteelisa North America")).toBeInTheDocument();
  });

  it("filters submittals by status", () => {
    render(<ConstructionSubmittalRegister submittals={sampleSubmittals} />);
    const filterSelect = screen.getByLabelText(/Filter Status:/i);
    fireEvent.change(filterSelect, { target: { value: "OVERDUE" } });

    expect(screen.getByText("08-4400-003")).toBeInTheDocument();
    expect(screen.queryByText("03-3000-014")).not.toBeInTheDocument();
  });

  it("allows updating review status on a submittal item", () => {
    const handleUpdate = vi.fn();
    render(
      <ConstructionSubmittalRegister
        submittals={sampleSubmittals}
        onUpdateStatus={handleUpdate}
      />
    );

    const actionSelect = screen.getByLabelText("Update status for submittal 03-3000-014");
    fireEvent.change(actionSelect, { target: { value: "APPROVED_AS_NOTED" } });

    expect(handleUpdate).toHaveBeenCalledWith("sub_033000_14", "APPROVED_AS_NOTED");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ConstructionSubmittalRegister submittals={sampleSubmittals} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
