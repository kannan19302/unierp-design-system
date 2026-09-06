import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { InpatientAcuityScorecard } from "./inpatient-acuity-scorecard";

describe("InpatientAcuityScorecard", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<InpatientAcuityScorecard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders patient banner and vital observations table", () => {
    render(<InpatientAcuityScorecard patientName="Eleanor Vance" mrn="MRN-774-0012" />);
    expect(screen.getByText("Eleanor Vance")).toBeInTheDocument();
    expect(screen.getByText("MRN-774-0012")).toBeInTheDocument();
    expect(screen.getByText(/National Early Warning Scorecard/i)).toBeInTheDocument();
    expect(screen.getByText("Respiration Rate")).toBeInTheDocument();
    expect(screen.getByText("Oxygen Saturation (SpO2)")).toBeInTheDocument();
  });

  it("acknowledges escalation protocol when triggered", () => {
    const onAcknowledge = vi.fn();
    render(<InpatientAcuityScorecard onAcknowledgeEscalation={onAcknowledge} />);

    const escalateBtn = screen.getByRole("button", { name: /Acknowledge clinical escalation protocol/i });
    expect(escalateBtn).toBeInTheDocument();
    fireEvent.click(escalateBtn);

    expect(onAcknowledge).toHaveBeenCalledWith(expect.any(Number), "HIGH_CRITICAL");
    expect(screen.getByText("MET Team Dispatched")).toBeInTheDocument();
  });
});
