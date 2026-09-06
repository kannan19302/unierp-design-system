import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ClinicalEdcFieldVerifier } from "./clinical-edc-field-verifier";

describe("ClinicalEdcFieldVerifier", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<ClinicalEdcFieldVerifier />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders study protocol and eCRF table entries", () => {
    render(<ClinicalEdcFieldVerifier studyProtocolNumber="PROTO-ONC-2026" subjectId="SUBJ-99" />);
    expect(screen.getByText("PROTO-ONC-2026")).toBeInTheDocument();
    expect(screen.getByText("Subject: SUBJ-99")).toBeInTheDocument();
    expect(screen.getByText("Systolic Blood Pressure")).toBeInTheDocument();
    expect(screen.getByText("Serum Creatinine")).toBeInTheDocument();
  });

  it("handles source data verification and eCRF locking", () => {
    const onVerify = vi.fn();
    const onLock = vi.fn();
    render(<ClinicalEdcFieldVerifier onVerifyField={onVerify} onLockForm={onLock} />);

    const verifyButtons = screen.getAllByRole("button", { name: /Verify source data/i });
    expect(verifyButtons.length).toBeGreaterThanOrEqual(1);
    fireEvent.click(verifyButtons[0]);
    expect(onVerify).toHaveBeenCalled();

    const lockButton = screen.getByRole("button", { name: /Lock eCRF form records/i });
    fireEvent.click(lockButton);
    expect(onLock).toHaveBeenCalled();
    expect(screen.getByText("eCRF Locked")).toBeInTheDocument();
  });
});
