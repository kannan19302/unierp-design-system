import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  EsgEmissionsCalculator,
  EmissionActivityLine,
} from "./esg-emissions-calculator";

const sampleActivities: EmissionActivityLine[] = [
  {
    id: "act-1",
    activityName: "Natural Gas Boiler Combustion",
    facilityName: "Plant Alpha",
    scope: "scope_1",
    quantity: 45000,
    unitOfMeasure: "therms",
    emissionFactor: 5.306,
    factorSource: "EPA 2026",
    tCo2e: 238.77,
  },
  {
    id: "act-2",
    activityName: "Grid Electricity",
    facilityName: "Austin Office",
    scope: "scope_2",
    quantity: 820000,
    unitOfMeasure: "kWh",
    emissionFactor: 0.3845,
    factorSource: "eGRID 2026",
    tCo2e: 315.29,
  },
];

describe("EsgEmissionsCalculator", () => {
  it("renders scope summary cards and activity lines", () => {
    render(
      <EsgEmissionsCalculator
        reportingYear={2026}
        activities={sampleActivities}
      />
    );

    expect(screen.getByText("Corporate ESG Greenhouse Gas (GHG) Ledger")).toBeInTheDocument();
    expect(screen.getByText("TOTAL CARBON FOOTPRINT")).toBeInTheDocument();
    expect(screen.getByText("Natural Gas Boiler Combustion")).toBeInTheDocument();
    expect(screen.getByText("SCOPE 1: DIRECT")).toBeInTheDocument();
    expect(screen.getByText("Grid Electricity")).toBeInTheDocument();
    expect(screen.getByText("SCOPE 2: ELECTRICITY")).toBeInTheDocument();
  });

  it("filters activities by scope", () => {
    render(
      <EsgEmissionsCalculator
        activities={sampleActivities}
      />
    );

    expect(screen.getByText("Natural Gas Boiler Combustion")).toBeInTheDocument();
    expect(screen.getByText("Grid Electricity")).toBeInTheDocument();

    const scope1Btn = screen.getByRole("button", { name: "Scope 1" });
    fireEvent.click(scope1Btn);

    expect(screen.getByText("Natural Gas Boiler Combustion")).toBeInTheDocument();
    expect(screen.queryByText("Grid Electricity")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <EsgEmissionsCalculator
        activities={sampleActivities}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
