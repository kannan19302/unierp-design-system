import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SubcontractorComplianceLienTracker } from "./subcontractor-compliance-lien-tracker";

const mockRecords = [
  {
    id: "sub-1",
    vendorName: "Apex Steel",
    tradeDivision: "05 12 00 - Structural",
    contractCode: "PKG-01",
    coiValidUntil: "2026-12-31",
    coiExpired: false,
    retainageHeld: 40000,
    currentBilling: 200000,
    lienStatus: "UNCONDITIONAL_PROGRESS" as const,
    paymentStatus: "AUTHORIZED" as const,
  },
  {
    id: "sub-2",
    vendorName: "Delta Mechanical",
    tradeDivision: "23 00 00 - HVAC",
    contractCode: "PKG-02",
    coiValidUntil: "2026-05-01",
    coiExpired: true,
    retainageHeld: 20000,
    currentBilling: 100000,
    lienStatus: "LIEN_NOTICE_FILED" as const,
    paymentStatus: "ON_HOLD" as const,
  },
];

describe("SubcontractorComplianceLienTracker", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(<SubcontractorComplianceLienTracker records={mockRecords} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders header, KPI metrics, and vendor names", () => {
    render(<SubcontractorComplianceLienTracker records={mockRecords} />);
    expect(
      screen.getByText("Subcontractor Compliance & Mechanic's Lien Waiver Tracker")
    ).toBeInTheDocument();
    expect(screen.getByText("Apex Steel")).toBeInTheDocument();
    expect(screen.getByText("Delta Mechanical")).toBeInTheDocument();
  });

  it("filters by trade division", () => {
    render(<SubcontractorComplianceLienTracker records={mockRecords} />);
    const select = screen.getByLabelText("Trade Division:");

    fireEvent.change(select, { target: { value: "05 12 00 - Structural" } });
    expect(screen.getByText("Apex Steel")).toBeInTheDocument();
    expect(screen.queryByText("Delta Mechanical")).not.toBeInTheDocument();
  });

  it("calls onAuthorizePayment for eligible vendors", () => {
    const handleAuth = vi.fn();
    render(
      <SubcontractorComplianceLienTracker
        records={mockRecords}
        onAuthorizePayment={handleAuth}
      />
    );

    const authBtn = screen.getByLabelText("Authorize disbursement for Apex Steel");
    fireEvent.click(authBtn);
    expect(handleAuth).toHaveBeenCalledWith("sub-1");

    // Disabled for at-risk vendor
    const blockedBtn = screen.getByLabelText("Authorize disbursement for Delta Mechanical");
    expect(blockedBtn).toBeDisabled();
  });

  it("calls onRequestLienWaiver", () => {
    const handleRequest = vi.fn();
    render(
      <SubcontractorComplianceLienTracker
        records={mockRecords}
        onRequestLienWaiver={handleRequest}
      />
    );

    const requestBtn = screen.getByLabelText("Request updated lien waiver from Delta Mechanical");
    fireEvent.click(requestBtn);
    expect(handleRequest).toHaveBeenCalledWith("sub-2");
  });
});
