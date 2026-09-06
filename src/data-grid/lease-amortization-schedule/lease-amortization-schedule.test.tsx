import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  LeaseAmortizationSchedule,
  LeaseSchedulePeriod,
} from "./lease-amortization-schedule";

const samplePeriods: LeaseSchedulePeriod[] = [
  {
    periodNumber: 1,
    paymentDate: "2026-10-01",
    paymentAmount: 62500,
    interestExpense: 14218,
    principalReduction: 48282,
    endingLiability: 3201718,
    rouDepreciation: 54166,
    endingRouAsset: 3195834,
    fiscalYear: 2026,
  },
  {
    periodNumber: 4,
    paymentDate: "2027-01-01",
    paymentAmount: 62500,
    interestExpense: 13582,
    principalReduction: 48918,
    endingLiability: 3055602,
    rouDepreciation: 54166,
    endingRouAsset: 3033336,
    fiscalYear: 2027,
  },
];

describe("LeaseAmortizationSchedule", () => {
  it("renders lease header and period schedule", () => {
    render(
      <LeaseAmortizationSchedule
        leaseIdentifier="LSE-HQ-008"
        assetDescription="Corporate Headquarters Lease"
        periods={samplePeriods}
      />
    );

    expect(screen.getByText("Corporate Headquarters Lease")).toBeInTheDocument();
    expect(screen.getByText("LSE-HQ-008")).toBeInTheDocument();
    expect(screen.getByText(/ASC 842 \/ IFRS 16 OPERATING LEASE/i)).toBeInTheDocument();
    expect(screen.getByText("2026-10-01")).toBeInTheDocument();
    expect(screen.getByText("$3,201,718")).toBeInTheDocument();
  });

  it("filters schedule by fiscal year", () => {
    render(
      <LeaseAmortizationSchedule
        periods={samplePeriods}
      />
    );

    const yearSelect = screen.getByLabelText(/Fiscal Year Schedule/i);
    expect(screen.getByText("2026-10-01")).toBeInTheDocument();
    expect(screen.getByText("2027-01-01")).toBeInTheDocument();

    // Filter to 2026 only
    fireEvent.change(yearSelect, { target: { value: "2026" } });
    expect(screen.getByText("2026-10-01")).toBeInTheDocument();
    expect(screen.queryByText("2027-01-01")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <LeaseAmortizationSchedule
        periods={samplePeriods}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
