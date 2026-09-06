import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import { ClinicalDecisionSupportAlert } from "./clinical-decision-support-alert";

describe("ClinicalDecisionSupportAlert", () => {
  const samplePatient = {
    name: "Robert M. Thorne",
    mrn: "MRN-8492019",
    age: 68,
    gender: "Male",
    egfr: 24,
    allergies: ["Penicillin"],
  };

  const sampleRecommendations = [
    {
      id: "alt-nystatin",
      title: "Switch to Nystatin",
      description: "No systemic interaction.",
    },
  ];

  const defaultProps = {
    alertId: "BPA-2026-9042",
    severity: "critical" as const,
    title: "Severe Drug-Drug Interaction: Fluconazole + Warfarin",
    patient: samplePatient,
    triggeringOrder: "Fluconazole 200mg PO Daily",
    clinicalExplanation: "Fluconazole inhibits CYP2C9 metabolism of warfarin.",
    recommendations: sampleRecommendations,
    onAcceptRecommendation: vi.fn(),
    onOverrideAlert: vi.fn(),
    onCancelOrder: vi.fn(),
  };

  it("renders clinical alert banner, patient context, and recommendations", () => {
    render(<ClinicalDecisionSupportAlert {...defaultProps} />);
    expect(screen.getByRole("alert")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        name: /Severe Drug-Drug Interaction: Fluconazole \+ Warfarin/i,
      })
    ).toBeDefined();
    expect(screen.getByText(/Robert M. Thorne/i)).toBeDefined();
    expect(screen.getByText("MRN-8492019")).toBeDefined();
    expect(screen.getByText("Switch to Nystatin")).toBeDefined();
  });

  it("accepts alternative recommendation when clicked", () => {
    const handleAccept = vi.fn();
    render(
      <ClinicalDecisionSupportAlert
        {...defaultProps}
        onAcceptRecommendation={handleAccept}
      />
    );
    const acceptBtn = screen.getByRole("button", { name: /accept & replace order/i });
    fireEvent.click(acceptBtn);
    expect(handleAccept).toHaveBeenCalledWith("alt-nystatin");
  });

  it("cancels order when cancel button is clicked", () => {
    const handleCancel = vi.fn();
    render(
      <ClinicalDecisionSupportAlert
        {...defaultProps}
        onCancelOrder={handleCancel}
      />
    );
    const cancelBtn = screen.getByRole("button", { name: /cancel order/i });
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalled();
  });

  it("allows clinician to enter override rationale", () => {
    const handleOverride = vi.fn();
    render(
      <ClinicalDecisionSupportAlert
        {...defaultProps}
        onOverrideAlert={handleOverride}
      />
    );
    const overrideBtn = screen.getByRole("button", {
      name: /document clinical override/i,
    });
    fireEvent.click(overrideBtn);

    const confirmBtn = screen.getByRole("button", {
      name: /acknowledge risk & proceed with order/i,
    });
    fireEvent.click(confirmBtn);
    expect(handleOverride).toHaveBeenCalled();
  });

  it("passes accessibility axe audit", async () => {
    const { container } = render(<ClinicalDecisionSupportAlert {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
