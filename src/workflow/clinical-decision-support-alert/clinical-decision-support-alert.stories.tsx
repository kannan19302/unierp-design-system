import type { Meta, StoryObj } from "@storybook/react";
import { ClinicalDecisionSupportAlert } from "./clinical-decision-support-alert";

const meta: Meta<typeof ClinicalDecisionSupportAlert> = {
  title: "Workflow/ClinicalDecisionSupportAlert",
  component: ClinicalDecisionSupportAlert,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ClinicalDecisionSupportAlert>;

const samplePatient = {
  name: "Robert M. Thorne",
  mrn: "MRN-8492019",
  age: 68,
  gender: "Male",
  egfr: 24,
  allergies: ["Penicillin", "Sulfa drugs"],
};

const sampleRecommendations = [
  {
    id: "alt-nystatin",
    title: "Switch to Nystatin Oral Suspension",
    description: "No systemic CYP2C9 inhibition; effective for localized oral candidiasis.",
    suggestedDose: "500,000 units PO QID Swish & Swallow × 10 days",
  },
  {
    id: "alt-dose-adjust",
    title: "Maintain Fluconazole with 50% Warfarin Dose Reduction",
    description: "Reduce Warfarin to 2.5mg PO Daily and schedule stat INR draw in 48 hours.",
    suggestedDose: "Warfarin 2.5mg PO Daily",
  },
];

export const CriticalContraindication: Story = {
  args: {
    alertId: "BPA-2026-9042",
    severity: "critical",
    title: "Severe Drug-Drug Interaction: Fluconazole + Warfarin (Lethal Hemorrhage Risk)",
    patient: samplePatient,
    triggeringOrder: "Fluconazole 200mg PO Daily × 14 days",
    clinicalExplanation:
      "Fluconazole is a potent inhibitor of CYP2C9 and CYP3A4, causing profound inhibition of S-warfarin clearance. Co-administration precipitates dramatic INR prolongation (INR > 10.0), resulting in high incidence of fatal internal hemorrhage unless dosage is immediately compensated with frequent INR monitoring.",
    evidenceGrade: "Grade 1A (Definite & Severe)",
    recommendations: sampleRecommendations,
    density: "compact",
  },
};

export const RenalDoseWarning: Story = {
  args: {
    alertId: "BPA-2026-9043",
    severity: "warning",
    title: "Renal Dosage Adjustment Recommended: eGFR < 30 mL/min",
    patient: samplePatient,
    triggeringOrder: "Metformin 1000mg PO BID",
    clinicalExplanation:
      "Metformin is substantially excreted by the kidney. Patient's eGFR is 24 mL/min/1.73m², placing them at heightened risk for lactic acidosis. Metformin is contraindicated with eGFR < 30 mL/min.",
    recommendations: [
      {
        id: "alt-linagliptin",
        title: "Switch to Linagliptin (Tradjenta)",
        description: "DPP-4 inhibitor primarily eliminated non-renally; no dosage adjustment needed in severe renal failure.",
        suggestedDose: "5mg PO Daily",
      },
    ],
    density: "compact",
  },
};
