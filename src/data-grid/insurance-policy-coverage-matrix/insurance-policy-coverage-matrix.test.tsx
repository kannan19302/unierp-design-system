import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  InsurancePolicyCoverageMatrix,
  PolicyCoverageLine,
} from "./insurance-policy-coverage-matrix";

const sampleLines: PolicyCoverageLine[] = [
  {
    id: "line-gl",
    lineOfBusiness: "Commercial General Liability",
    carrierSyndicate: "Chubb Global Markets",
    perOccurrenceLimit: 2000000,
    aggregateLimit: 4000000,
    deductibleSir: 25000,
    annualPremium: 42500,
    status: "bound",
    endorsements: ["Additional Insured"],
    sublimits: [
      {
        perilName: "Personal & Advertising Injury",
        limitAmount: 2000000,
        deductible: 25000,
      },
    ],
  },
];

describe("InsurancePolicyCoverageMatrix", () => {
  it("renders policyholder, master policy number, and coverage lines", () => {
    render(
      <InsurancePolicyCoverageMatrix
        policyholderName="Acme Global Corp"
        masterPolicyNumber="POL-2026-US-8910"
        effectiveDates="Jan 1, 2026 – Dec 31, 2026"
        coverageLines={sampleLines}
      />
    );

    expect(screen.getByText("Acme Global Corp")).toBeDefined();
    expect(screen.getByText("POL-2026-US-8910")).toBeDefined();
    expect(screen.getByText("Commercial General Liability")).toBeDefined();
    expect(screen.getByText("Chubb Global Markets")).toBeDefined();
  });

  it("expands sublimits row when expand button is clicked", () => {
    render(
      <InsurancePolicyCoverageMatrix
        policyholderName="Acme Global Corp"
        masterPolicyNumber="POL-2026-US-8910"
        effectiveDates="Jan 1, 2026 – Dec 31, 2026"
        coverageLines={sampleLines}
      />
    );

    const expandBtn = screen.getByRole("button", {
      name: /Expand sub-limits for Commercial General Liability/i,
    });
    fireEvent.click(expandBtn);

    expect(screen.getByText("Personal & Advertising Injury")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <InsurancePolicyCoverageMatrix
        policyholderName="Acme Global Corp"
        masterPolicyNumber="POL-2026-US-8910"
        effectiveDates="Jan 1, 2026 – Dec 31, 2026"
        coverageLines={sampleLines}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
