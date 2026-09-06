import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { RentRollFinancialSchedule, LeaseUnitRow } from "./rent-roll-financial-schedule";

const TEST_UNITS: LeaseUnitRow[] = [
  {
    id: "u1",
    unitNumber: "U-101",
    unitType: "Retail",
    tenantName: "Acme Cafe",
    squareFeet: 1500,
    leaseStart: "2023-01-01",
    leaseEnd: "2028-01-01",
    monthlyRent: 5000,
    camCharges: 500,
    depositHeld: 10000,
    arrearsAmount: 0,
    status: "active",
  },
  {
    id: "u2",
    unitNumber: "U-102",
    unitType: "Office",
    tenantName: "Beta Corp",
    squareFeet: 2500,
    leaseStart: "2022-01-01",
    leaseEnd: "2026-01-01",
    monthlyRent: 8000,
    camCharges: 800,
    depositHeld: 16000,
    arrearsAmount: 16000,
    status: "delinquent",
  },
  {
    id: "u3",
    unitNumber: "U-103",
    unitType: "Office",
    tenantName: "",
    squareFeet: 1000,
    leaseStart: "",
    leaseEnd: "",
    monthlyRent: 0,
    camCharges: 0,
    depositHeld: 0,
    arrearsAmount: 0,
    status: "vacant",
  },
];

describe("RentRollFinancialSchedule", () => {
  it("renders property title, rent roll metrics, and has zero accessibility violations", async () => {
    const { container } = render(
      <RentRollFinancialSchedule
        propertyName="Metropolitan Tower"
        units={TEST_UNITS}
      />
    );

    expect(screen.getByText("Metropolitan Tower")).toBeInTheDocument();
    expect(screen.getByText("Acme Cafe")).toBeInTheDocument();
    expect(screen.getByText("Beta Corp")).toBeInTheDocument();
    expect(screen.getByText("— Vacant Space —")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("triggers onRowClick when a unit row is clicked", () => {
    const handleRowClick = vi.fn();
    render(
      <RentRollFinancialSchedule
        propertyName="Metropolitan Tower"
        units={TEST_UNITS}
        onRowClick={handleRowClick}
      />
    );

    const cafeRow = screen.getByText("Acme Cafe").closest("tr");
    if (cafeRow) {
      fireEvent.click(cafeRow);
      expect(handleRowClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: "u1", unitNumber: "U-101" })
      );
    }
  });

  it("filters rows by status tabs", () => {
    render(
      <RentRollFinancialSchedule
        propertyName="Metropolitan Tower"
        units={TEST_UNITS}
      />
    );

    const delinquentTab = screen.getByRole("button", { name: /^Delinquent$/i });
    fireEvent.click(delinquentTab);

    expect(screen.getByText("Beta Corp")).toBeInTheDocument();
    expect(screen.queryByText("Acme Cafe")).not.toBeInTheDocument();
  });
});
