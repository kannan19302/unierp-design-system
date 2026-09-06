import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { MultiUnitLeasingMatrix, CommercialLeaseUnit } from "./multi-unit-leasing-matrix";

const sampleUnits: CommercialLeaseUnit[] = [
  {
    id: "suite-1400",
    unitCode: "SUITE-1400",
    floor: 14,
    rentableSqFt: 18500,
    usableSqFt: 16800,
    tenantName: "Apex Global Payments",
    industry: "Financial Technology",
    baseRentPerSqFt: 86.5,
    camNnnPerSqFt: 19.2,
    leaseCommencement: "2021-06-01",
    leaseExpiration: "2027-05-31",
    status: "leased",
  },
  {
    id: "suite-1600",
    unitCode: "SUITE-1600",
    floor: 16,
    rentableSqFt: 14200,
    usableSqFt: 12900,
    baseRentPerSqFt: 82.0,
    camNnnPerSqFt: 18.5,
    status: "available",
  },
];

describe("MultiUnitLeasingMatrix", () => {
  it("renders property title, KPI rollups, and units correctly", () => {
    render(
      <MultiUnitLeasingMatrix
        propertyName="One Embarcadero Center"
        units={sampleUnits}
      />
    );

    expect(screen.getByText("One Embarcadero Center")).toBeDefined();
    expect(screen.getByText("SUITE-1400")).toBeDefined();
    expect(screen.getByText("Apex Global Payments")).toBeDefined();
    expect(screen.getByText("SUITE-1600")).toBeDefined();
    expect(screen.getByText("Vacant Space")).toBeDefined();
  });

  it("filters units by lease status", () => {
    render(
      <MultiUnitLeasingMatrix
        propertyName="One Embarcadero Center"
        units={sampleUnits}
      />
    );

    const statusSelect = screen.getByLabelText("Lease Status:");
    fireEvent.change(statusSelect, { target: { value: "available" } });

    expect(screen.queryByText("Apex Global Payments")).toBeNull();
    expect(screen.getByText("SUITE-1600")).toBeDefined();
  });

  it("invokes onActionClick when Manage button is clicked", () => {
    const handleAction = vi.fn();

    render(
      <MultiUnitLeasingMatrix
        propertyName="One Embarcadero Center"
        units={sampleUnits}
        onActionClick={handleAction}
      />
    );

    const manageButtons = screen.getAllByRole("button", { name: /Manage lease agreement/i });
    fireEvent.click(manageButtons[0]);

    expect(handleAction).toHaveBeenCalledWith("edit_lease", sampleUnits[0]);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <MultiUnitLeasingMatrix
        propertyName="One Embarcadero Center"
        units={sampleUnits}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
