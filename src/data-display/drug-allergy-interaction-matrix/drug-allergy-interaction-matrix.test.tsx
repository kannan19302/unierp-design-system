import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DrugAllergyInteractionMatrix,
  DrugAllergyInteractionItem,
} from "./drug-allergy-interaction-matrix";

const sampleInteractions: DrugAllergyInteractionItem[] = [
  {
    id: "int_warf_asp_01",
    drugName: "Warfarin Sodium 5mg",
    allergenOrInteractingDrug: "Aspirin 81mg",
    severity: "CONTRAINDICATED",
    clinicalEffect: "Severe risk of gastrointestinal hemorrhage",
    recommendation: "Avoid concurrent therapy.",
  },
];

describe("DrugAllergyInteractionMatrix", () => {
  it("renders patient banner and clinical interaction alerts", () => {
    render(
      <DrugAllergyInteractionMatrix
        patientName="Eleanor Vance"
        mrn="EHR-902-8471"
        activeMedications={["Warfarin Sodium 5mg"]}
        documentedAllergies={["Penicillin"]}
        interactions={sampleInteractions}
      />
    );
    expect(
      screen.getByText(/Drug-Drug & Drug-Allergy Interaction Screening Matrix/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Eleanor Vance")).toBeInTheDocument();
    expect(screen.getByText("MRN: EHR-902-8471")).toBeInTheDocument();
    expect(screen.getAllByText("Warfarin Sodium 5mg").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Aspirin 81mg")).toBeInTheDocument();
  });

  it("handles overriding an interaction with clinical rationale", () => {
    const handleOverride = vi.fn();
    render(
      <DrugAllergyInteractionMatrix
        patientName="Eleanor Vance"
        mrn="EHR-902-8471"
        activeMedications={["Warfarin Sodium 5mg"]}
        documentedAllergies={["Penicillin"]}
        interactions={sampleInteractions}
        onOverrideInteraction={handleOverride}
      />
    );

    const overrideBtn = screen.getByRole("button", {
      name: /Override CONTRAINDICATED interaction alert for Warfarin Sodium 5mg/i,
    });
    fireEvent.click(overrideBtn);

    const input = screen.getByPlaceholderText(/Clinical justification.../i);
    fireEvent.change(input, {
      target: { value: "Cardiology approved for mechanical aortic valve" },
    });

    const saveBtn = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveBtn);

    expect(handleOverride).toHaveBeenCalledWith(
      "int_warf_asp_01",
      "Cardiology approved for mechanical aortic valve"
    );
    expect(screen.getByText("Overridden")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DrugAllergyInteractionMatrix
        patientName="Eleanor Vance"
        mrn="EHR-902-8471"
        activeMedications={["Warfarin Sodium 5mg"]}
        documentedAllergies={["Penicillin"]}
        interactions={sampleInteractions}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
