import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ClinicalOrderEntryPad, type PatientBannerInfo } from "./clinical-order-entry-pad";

const mockPatient: PatientBannerInfo = {
  mrn: "MRN-8472901",
  fullName: "Eleanor Vance",
  age: 64,
  gender: "Female",
  roomBed: "ICU Bed 04",
  allergies: ["Penicillin", "Sulfa drugs"],
  weightKg: 68.5,
};

describe("ClinicalOrderEntryPad", () => {
  it("renders patient banner and order entry fields", () => {
    render(<ClinicalOrderEntryPad patient={mockPatient} />);
    expect(screen.getByText("Eleanor Vance")).toBeDefined();
    expect(screen.getByText("MRN: MRN-8472901")).toBeDefined();
    expect(screen.getByText("PENICILLIN")).toBeDefined();
    expect(screen.getByText("SULFA DRUGS")).toBeDefined();
    expect(screen.getByText("Clinical Order Composition")).toBeDefined();
  });

  it("adds a new clinical order to staged basket", () => {
    render(<ClinicalOrderEntryPad patient={mockPatient} />);
    const nameInput = screen.getByLabelText(/Order Description \/ Drug Formulation/i);
    const detailsInput = screen.getByLabelText(/Dosing, Route, Frequency & Clinical Instructions/i);
    const stageBtn = screen.getByText("+ Stage Order in Basket");

    fireEvent.change(nameInput, { target: { value: "Vancomycin IV" } });
    fireEvent.change(detailsInput, { target: { value: "1g IV q12h" } });
    fireEvent.click(stageBtn);

    expect(screen.getByText("Vancomycin IV")).toBeDefined();
    expect(screen.getByText("1g IV q12h")).toBeDefined();
  });

  it("detects allergy contraindication and requires medical override", () => {
    render(<ClinicalOrderEntryPad patient={mockPatient} />);
    const nameInput = screen.getByLabelText(/Order Description \/ Drug Formulation/i);
    const stageBtn = screen.getByText("+ Stage Order in Basket");

    fireEvent.change(nameInput, { target: { value: "Penicillin G Sodium IV" } });
    fireEvent.click(stageBtn);

    expect(
      screen.getByText(/CRITICAL CONTRAINDICATION: Patient allergic to PENICILLIN/i)
    ).toBeDefined();

    // Check override checkbox
    const overrideCheckbox = screen.getByLabelText(
      /I acknowledge the clinical risk and certify medical necessity override/i
    );
    expect(overrideCheckbox).toBeDefined();
    fireEvent.click(overrideCheckbox);

    // Enter PIN
    const pinInput = screen.getByLabelText(/E-Sign PIN:/i);
    fireEvent.change(pinInput, { target: { value: "1234" } });

    const submitBtn = screen.getByText("Electronically Sign & Transmit");
    expect((submitBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ClinicalOrderEntryPad
        patient={mockPatient}
        initialOrders={[
          {
            id: "ord-1",
            category: "medication",
            orderName: "Acetaminophen Oral",
            details: "650mg PO q6h PRN pain",
            priority: "routine",
          },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
