import type { Meta, StoryObj } from "@storybook/react";
import {
  DrugAllergyInteractionMatrix,
  DrugAllergyInteractionItem,
} from "./drug-allergy-interaction-matrix";

const sampleInteractions: DrugAllergyInteractionItem[] = [
  {
    id: "int_warf_asp_01",
    drugName: "Warfarin Sodium 5mg PO Daily",
    allergenOrInteractingDrug: "Aspirin 81mg PO Daily",
    severity: "CONTRAINDICATED",
    clinicalEffect:
      "Severe risk of gastrointestinal hemorrhage, major bleeding events, and prolonged prothrombin time.",
    recommendation:
      "Avoid concurrent therapy unless mechanical heart valve present. Consider PPI gastroprotection and frequent INR monitoring.",
  },
  {
    id: "int_lis_spiro_02",
    drugName: "Lisinopril 20mg PO Daily",
    allergenOrInteractingDrug: "Spironolactone 25mg PO Daily",
    severity: "MAJOR",
    clinicalEffect:
      "Synergistic potassium retention leading to severe life-threatening hyperkalemia and cardiac dysrhythmia.",
    recommendation:
      "Monitor serum potassium and renal panel within 1 week of initiation and periodically thereafter.",
  },
  {
    id: "int_pen_amox_03",
    drugName: "Amoxicillin-Clavulanate 875mg PO BID",
    allergenOrInteractingDrug: "Penicillin (Documented Anaphylaxis)",
    severity: "CONTRAINDICATED",
    clinicalEffect:
      "Direct beta-lactam cross-reactivity triggering IgE-mediated anaphylaxis, bronchospasm, and hemodynamic collapse.",
    recommendation:
      "Contraindicated. Cancel order immediately. Switch to non-beta-lactam alternative (e.g. Azithromycin or Doxycycline).",
  },
  {
    id: "int_atorv_clari_04",
    drugName: "Atorvastatin 40mg PO QHS",
    allergenOrInteractingDrug: "Clarithromycin 500mg PO BID",
    severity: "MODERATE",
    clinicalEffect:
      "CYP3A4 inhibition markedly increases statin systemic exposure, elevating risk of rhabdomyolysis and myopathy.",
    recommendation:
      "Temporarily suspend atorvastatin therapy during clarithromycin course or use azithromycin.",
  },
];

const meta: Meta<typeof DrugAllergyInteractionMatrix> = {
  title: "Data Display/DrugAllergyInteractionMatrix",
  component: DrugAllergyInteractionMatrix,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DrugAllergyInteractionMatrix>;

export const Default: Story = {
  args: {
    patientName: "Eleanor Vance",
    mrn: "EHR-902-8471",
    activeMedications: ["Warfarin Sodium 5mg", "Lisinopril 20mg", "Atorvastatin 40mg"],
    documentedAllergies: ["Penicillin", "Sulfa Antibiotics"],
    interactions: sampleInteractions,
  },
};

export const UltraCompact: Story = {
  args: {
    patientName: "Eleanor Vance",
    mrn: "EHR-902-8471",
    activeMedications: ["Warfarin Sodium 5mg", "Lisinopril 20mg", "Atorvastatin 40mg"],
    documentedAllergies: ["Penicillin", "Sulfa Antibiotics"],
    interactions: sampleInteractions,
    density: "ultra-compact",
  },
};
