import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  CamExpenseReconciliationLedger,
  PropertySpecification,
  CamExpenseItem,
} from "./cam-expense-reconciliation-ledger";

const sampleProperty: PropertySpecification = {
  id: "prop_one_financial_01",
  propertyName: "One Financial Center, Boston",
  tenantName: "Deloitte Global Services LLC",
  suiteNumber: "Suite 2400",
  leasedAreaSqFt: 45000,
  buildingGrossLeasableSqFt: 600000,
  proRataSharePercent: 7.5,
  fiscalYear: 2025,
};

const sampleCategories: CamExpenseItem[] = [
  {
    id: "cam_exp_hvac_01",
    expenseCategory: "HVAC Operations & Maintenance",
    annualBudgetUsd: 450000.0,
    actualExpenseUsd: 472500.0,
    varianceUsd: 22500.0,
    tenantShareEstimatedUsd: 33750.0,
    tenantShareActualUsd: 35437.5,
    reconciliationDueUsd: 1687.5,
  },
];

describe("CamExpenseReconciliationLedger", () => {
  it("renders property details and expense category rows", () => {
    render(
      <CamExpenseReconciliationLedger
        property={sampleProperty}
        expenseCategories={sampleCategories}
      />
    );
    expect(
      screen.getByText(/Common Area Maintenance \(CAM\) Expense Reconciliation/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/One Financial Center, Boston/i)).toBeInTheDocument();
    expect(screen.getByText("HVAC Operations & Maintenance")).toBeInTheDocument();
    expect(screen.getByText("Tenant Owes Landlord")).toBeInTheDocument();
  });

  it("handles approval of CAM reconciliation statement", () => {
    const handleApprove = vi.fn();
    render(
      <CamExpenseReconciliationLedger
        property={sampleProperty}
        expenseCategories={sampleCategories}
        onApproveReconciliation={handleApprove}
      />
    );

    const approveButton = screen.getByRole("button", {
      name: /Approve CAM Reconciliation True-Up Statement/i,
    });
    fireEvent.click(approveButton);

    expect(handleApprove).toHaveBeenCalledWith("prop_one_financial_01", 1687.5);
    expect(screen.getByText("True-Up Approved & Invoiced")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <CamExpenseReconciliationLedger
        property={sampleProperty}
        expenseCategories={sampleCategories}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
