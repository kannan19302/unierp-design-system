import type { Meta, StoryObj } from "@storybook/react";
import {
  SupplierTaxComplianceVerifier,
  SupplierTaxProfile,
} from "./supplier-tax-compliance-verifier";

const mockSupplier: SupplierTaxProfile = {
  supplierId: "VEND-8891",
  legalName: "Acme Industrial Logistics B.V.",
  operatingCountry: "Netherlands (NL)",
  taxIdType: "EU-VAT",
  taxIdentificationNumber: "NL847291849B01",
  viesValidationTimestamp: "2026-09-05T14:30:00Z",
  status: "verified",
  withholdingTaxRatePct: 0.0,
  certificates: [
    {
      id: "doc-1",
      documentType: "VAT_Certificate",
      fileReference: "NL-Tax-Chamber-Commerce-2026.pdf",
      uploadedAt: "2026-01-14",
      expiryDate: "2027-01-14",
      verifiedByCompliance: true,
    },
    {
      id: "doc-2",
      documentType: "W-8BEN-E",
      fileReference: "W8BENE-Acme-Signed.pdf",
      uploadedAt: "2026-02-01",
      expiryDate: "2029-12-31",
      verifiedByCompliance: true,
    },
  ],
  auditNotes:
    "Cross-border reverse charge VAT mechanism active under EU Council Directive 2006/112/EC Art 194. Withholding reduced to 0.0% via US-NL bilateral income tax treaty.",
};

const meta: Meta<typeof SupplierTaxComplianceVerifier> = {
  title: "Workflow/SupplierTaxComplianceVerifier",
  component: SupplierTaxComplianceVerifier,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SupplierTaxComplianceVerifier>;

export const Default: Story = {
  args: {
    supplier: mockSupplier,
  },
};

export const PendingVerification: Story = {
  args: {
    supplier: {
      ...mockSupplier,
      supplierId: "VEND-9923",
      legalName: "Tokyo Robotics Engineering K.K.",
      operatingCountry: "Japan (JP)",
      taxIdType: "UK-UTR",
      taxIdentificationNumber: "JP-7010401012345",
      status: "pending_vies",
      withholdingTaxRatePct: 20.42,
      certificates: [],
      auditNotes: "Awaiting signed Form W-8BEN-E to determine treaty rate eligibility.",
    },
  },
};

export const UltraCompactDensity: Story = {
  args: {
    supplier: mockSupplier,
    density: "ultra-compact",
  },
};
