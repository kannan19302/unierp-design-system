import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  SupplierTaxComplianceVerifier,
  SupplierTaxProfile,
} from "./supplier-tax-compliance-verifier";

const mockSupplier: SupplierTaxProfile = {
  supplierId: "VEND-8891",
  legalName: "Acme Logistics B.V.",
  operatingCountry: "Netherlands (NL)",
  taxIdType: "EU-VAT",
  taxIdentificationNumber: "NL847291849B01",
  status: "verified",
  withholdingTaxRatePct: 0.0,
  certificates: [
    {
      id: "doc-1",
      documentType: "VAT_Certificate",
      fileReference: "NL-Tax-Cert.pdf",
      uploadedAt: "2026-01-14",
      verifiedByCompliance: true,
    },
  ],
  auditNotes: "Treaty exemption verified.",
};

describe("SupplierTaxComplianceVerifier", () => {
  it("renders supplier legal name and tax identifiers", () => {
    render(<SupplierTaxComplianceVerifier supplier={mockSupplier} />);
    expect(
      screen.getByText("Supplier Tax Compliance: Acme Logistics B.V.")
    ).toBeInTheDocument();
    expect(screen.getByText("NL847291849B01")).toBeInTheDocument();
    expect(screen.getByText("EU-VAT")).toBeInTheDocument();
    expect(screen.getByText("NL-Tax-Cert.pdf")).toBeInTheDocument();
  });

  it("handles live TIN validation button click", () => {
    const onTriggerTinMatch = vi.fn();
    render(
      <SupplierTaxComplianceVerifier
        supplier={mockSupplier}
        onTriggerTinMatch={onTriggerTinMatch}
      />
    );

    const checkBtn = screen.getByRole("button", {
      name: /Live TIN \/ VIES Check/i,
    });
    fireEvent.click(checkBtn);
    expect(onTriggerTinMatch).toHaveBeenCalledWith(
      "VEND-8891",
      "NL847291849B01"
    );
  });

  it("handles approve tax profile action", () => {
    const onApprove = vi.fn();
    render(
      <SupplierTaxComplianceVerifier
        supplier={mockSupplier}
        onApproveTaxProfile={onApprove}
      />
    );

    const approveBtn = screen.getByRole("button", {
      name: /Approve Profile/i,
    });
    fireEvent.click(approveBtn);
    expect(onApprove).toHaveBeenCalledWith("VEND-8891");
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <SupplierTaxComplianceVerifier supplier={mockSupplier} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
