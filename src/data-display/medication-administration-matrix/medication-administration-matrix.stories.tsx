import type { Meta, StoryObj } from "@storybook/react";
import {
  MedicationAdministrationMatrix,
  type MedicationOrder,
} from "./medication-administration-matrix";

const mockOrders: MedicationOrder[] = [
  {
    id: "med-1",
    drugName: "Insulin Glargine (Lantus)",
    dosage: "24 Units SubQ",
    route: "subq",
    frequency: "Once Daily at Bedtime",
    scheduledTime: "21:00",
    isHighAlert: true,
    requiresCoSign: true,
    status: "due",
    scanState: "pending",
  },
  {
    id: "med-2",
    drugName: "Metformin HCl",
    dosage: "500 mg Oral Tablet",
    route: "oral",
    frequency: "Twice Daily with Meals",
    scheduledTime: "08:00",
    status: "given",
    scanState: "verified",
    administeredBy: "RN Sarah Jenkins (#4412)",
  },
  {
    id: "med-3",
    drugName: "Lisinopril",
    dosage: "10 mg Oral Tablet",
    route: "oral",
    frequency: "Daily Morning",
    scheduledTime: "08:00",
    status: "given",
    scanState: "verified",
    administeredBy: "RN Sarah Jenkins (#4412)",
  },
  {
    id: "med-4",
    drugName: "Heparin Sodium Infusion",
    dosage: "1,200 Units/hr IV Continuous",
    route: "iv",
    frequency: "Continuous Infusion",
    scheduledTime: "12:00",
    isHighAlert: true,
    requiresCoSign: true,
    status: "due",
    scanState: "pending",
  },
];

const meta: Meta<typeof MedicationAdministrationMatrix> = {
  title: "DataDisplay/MedicationAdministrationMatrix",
  component: MedicationAdministrationMatrix,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MedicationAdministrationMatrix>;

export const Default: Story = {
  args: {
    patientName: "Eleanor Vance (Age 68)",
    mrn: "MRN-884109-A",
    allergies: ["Penicillin", "Sulfa Drugs"],
    orders: mockOrders,
  },
};

export const CriticalAllergy: Story = {
  args: {
    patientName: "Arthur Pendelton (Age 54)",
    mrn: "MRN-902148-B",
    allergies: ["Latex", "Morphine", "Aspirin"],
    orders: [
      ...mockOrders,
      {
        id: "med-5",
        drugName: "Amoxicillin / Clavulanate",
        dosage: "875 mg Oral",
        route: "oral",
        frequency: "Q12H",
        scheduledTime: "14:00",
        allergyWarning: "Patient has documented Penicillin family allergy!",
        status: "held",
        scanState: "pending",
      },
    ],
  },
};
