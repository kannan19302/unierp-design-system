import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  MedicationAdministrationMatrix,
  type MedicationOrder,
} from "./medication-administration-matrix";

const testOrders: MedicationOrder[] = [
  {
    id: "med-1",
    drugName: "Insulin Glargine",
    dosage: "20 Units SubQ",
    route: "subq",
    frequency: "Daily",
    scheduledTime: "21:00",
    isHighAlert: true,
    status: "due",
    scanState: "pending",
  },
  {
    id: "med-2",
    drugName: "Lisinopril",
    dosage: "10 mg Oral",
    route: "oral",
    frequency: "Daily",
    scheduledTime: "08:00",
    status: "given",
    scanState: "verified",
    administeredBy: "RN Jenkins",
  },
];

describe("MedicationAdministrationMatrix", () => {
  it("renders patient details, allergies, and medication rows correctly", () => {
    render(
      <MedicationAdministrationMatrix
        patientName="Eleanor Vance"
        mrn="MRN-884109-A"
        allergies={["Penicillin"]}
        orders={testOrders}
      />
    );

    expect(screen.getByText("Eleanor Vance")).toBeInTheDocument();
    expect(screen.getByText("MRN-884109-A")).toBeInTheDocument();
    expect(screen.getByText("Penicillin")).toBeInTheDocument();
    expect(screen.getByText("Insulin Glargine")).toBeInTheDocument();
    expect(screen.getByText("Lisinopril")).toBeInTheDocument();
  });

  it("opens dual witness verification dialog for high alert medication", () => {
    const onAdmin = vi.fn();
    render(
      <MedicationAdministrationMatrix
        patientName="Eleanor Vance"
        orders={testOrders}
        onAdministerDose={onAdmin}
      />
    );

    const adminBtn = screen.getByRole("button", { name: /Administer Dose/i });
    fireEvent.click(adminBtn);

    expect(screen.getByText(/High-Alert Medication Protocol/i)).toBeInTheDocument();

    const witnessInput = screen.getByLabelText(/Witness RN Name/i);
    fireEvent.change(witnessInput, { target: { value: "RN Marcus Aurel" } });

    const confirmBtn = screen.getByRole("button", { name: /Confirm Administration/i });
    fireEvent.click(confirmBtn);

    expect(onAdmin).toHaveBeenCalledWith("med-1", "RN Marcus Aurel");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <MedicationAdministrationMatrix
        patientName="Eleanor Vance"
        orders={testOrders}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
