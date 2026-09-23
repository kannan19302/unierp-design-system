import type { Meta, StoryObj } from "@storybook/react";
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

const meta: Meta<typeof ClinicalOrderEntryPad> = {
  title: "Platforms/BusinessSuite/ClinicalHealthcare/ClinicalOrderEntryPad",
  component: ClinicalOrderEntryPad,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    patient: mockPatient,
  },
};

export default meta;
type Story = StoryObj<typeof ClinicalOrderEntryPad>;

export const Default: Story = {
  args: {},
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};

export const WithPreselectedOrders: Story = {
  args: {
    initialOrders: [
      {
        id: "ord-1",
        category: "medication",
        orderName: "Amoxicillin 500mg Oral Capsule",
        details: "500 mg PO TID with meals for 10 days",
        priority: "routine",
        contraindicationWarning: "CRITICAL CONTRAINDICATION: Patient allergic to PENICILLIN.",
      },
      {
        id: "ord-2",
        category: "lab",
        orderName: "Complete Blood Count (CBC) with Differential",
        details: "Draw venous specimen fasting 8h stat",
        priority: "stat",
      },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...WithPreselectedOrders.args,
    density: "standard",
  },
  render: (args) => (
    <div style={{ inlineSize: "100%", maxInlineSize: "960px" }}>
      <ClinicalOrderEntryPad {...args} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>Empty Staging Basket</h4>
        <ClinicalOrderEntryPad patient={mockPatient} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)" }}>With Staged Orders &amp; Allergy Warning</h4>
        <ClinicalOrderEntryPad
          patient={mockPatient}
          initialOrders={[
            {
              id: "ord-1",
              category: "medication",
              orderName: "Amoxicillin 500mg Oral Capsule",
              details: "500 mg PO TID with meals for 10 days",
              priority: "routine",
              contraindicationWarning: "CRITICAL CONTRAINDICATION: Patient allergic to PENICILLIN.",
            },
          ]}
          density="standard"
        />
      </div>
    </div>
  ),
};
