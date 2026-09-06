import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  TenantScreeningScorecard,
  TenantApplicantProfile,
} from "./tenant-screening-scorecard";

const mockApplicant: TenantApplicantProfile = {
  applicantId: "APP-2026-904",
  fullName: "Marcus Vance",
  targetUnit: "Unit 402 - 2BR / 2BA ($2,850/mo)",
  propertyAddress: "1040 Meridian Way, Seattle, WA",
  monthlyIncome: 9500,
  monthlyRent: 2850,
  rentToIncomePct: 30.0,
  overallScore: 88,
  automatedRecommendation: "approve",
  criteria: [
    {
      id: "c1",
      category: "credit",
      name: "FICO Credit Score (Experian)",
      observedValue: "745",
      thresholdRequired: ">= 650",
      status: "pass",
      details: "No delinquent accounts reported.",
    },
    {
      id: "c2",
      category: "income",
      name: "Verified Monthly Net Income",
      observedValue: "$9,500/mo (3.33x rent)",
      thresholdRequired: ">= 3.0x monthly rent",
      status: "pass",
      details: "Payroll direct deposit verified.",
    },
  ],
};

describe("TenantScreeningScorecard", () => {
  it("renders applicant metadata and underwriting score", () => {
    render(<TenantScreeningScorecard applicant={mockApplicant} />);
    expect(screen.getByText("Marcus Vance")).toBeInTheDocument();
    expect(screen.getByText("APP-2026-904")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("FICO Credit Score (Experian)")).toBeInTheDocument();
  });

  it("handles adjudication action button clicks", () => {
    const onApprove = vi.fn();
    const onDecline = vi.fn();
    const onOverride = vi.fn();

    render(
      <TenantScreeningScorecard
        applicant={mockApplicant}
        onApproveApplication={onApprove}
        onDeclineApplication={onDecline}
        onOverrideDecision={onOverride}
      />
    );

    const declineBtn = screen.getByRole("button", { name: /Decline Applicant/i });
    fireEvent.click(declineBtn);
    expect(onDecline).toHaveBeenCalledWith("APP-2026-904", expect.any(String));

    const conditionalBtn = screen.getByRole("button", { name: /Require 2x Security Deposit/i });
    fireEvent.click(conditionalBtn);
    expect(onOverride).toHaveBeenCalledWith("APP-2026-904", "conditional_deposit");
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <TenantScreeningScorecard applicant={mockApplicant} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
