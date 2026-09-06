import React, { useId, useState } from "react";
import styles from "./supplier-tax-compliance-verifier.module.css";

export type TaxValidationStatus =
  | "verified"
  | "pending_vies"
  | "invalid_id"
  | "exempt_certificate_active"
  | "expired";

export interface TaxDocumentCertificate {
  id: string;
  documentType: "W-9" | "W-8BEN-E" | "VAT_Certificate" | "Resale_Exemption";
  fileReference: string; // "W9-AcmeCorp-2026.pdf"
  uploadedAt: string;
  expiryDate?: string;
  verifiedByCompliance: boolean;
}

export interface SupplierTaxProfile {
  supplierId: string; // "VEND-8891"
  legalName: string; // "Acme Industrial Logistics B.V."
  operatingCountry: string; // "Netherlands (NL)"
  taxIdType: "EU-VAT" | "US-EIN" | "GSTIN" | "UK-UTR";
  taxIdentificationNumber: string; // "NL847291849B01"
  viesValidationTimestamp?: string; // "2026-09-05T14:30:00Z"
  status: TaxValidationStatus;
  withholdingTaxRatePct: number; // 0.0% or 15.0% or 30.0%
  certificates: TaxDocumentCertificate[];
  auditNotes: string;
}

export interface SupplierTaxComplianceVerifierProps {
  supplier: SupplierTaxProfile;
  onTriggerTinMatch?: (supplierId: string, tin: string) => void;
  onApproveTaxProfile?: (supplierId: string) => void;
  onRequestNewDocument?: (supplierId: string, docType: string) => void;
  onUploadCertificate?: (supplierId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const SupplierTaxComplianceVerifier: React.FC<SupplierTaxComplianceVerifierProps> = ({
  supplier,
  onTriggerTinMatch,
  onApproveTaxProfile,
  onRequestNewDocument: _onRequestNewDocument,
  onUploadCertificate,
  density = "compact",
  className = "",
}) => {

  const headingId = useId();
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const handleValidateTin = () => {
    setIsValidating(true);
    onTriggerTinMatch?.(supplier.supplierId, supplier.taxIdentificationNumber);
    setTimeout(() => {
      setIsValidating(false);
    }, 800);
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            🏛️
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.vendorBadge}>{supplier.supplierId}</span>
              <span className={styles.countryBadge}>{supplier.operatingCountry}</span>
              <span
                className={`${styles.statusBadge} ${
                  supplier.status === "verified" ||
                  supplier.status === "exempt_certificate_active"
                    ? styles.statusVerified
                    : supplier.status === "pending_vies"
                    ? styles.statusPending
                    : styles.statusError
                }`}
              >
                {supplier.status.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Supplier Tax Compliance: {supplier.legalName}
            </h2>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.viesBtn}
            onClick={handleValidateTin}
            disabled={isValidating}
          >
            {isValidating ? "Validating TIN..." : "⚡ Live TIN / VIES Check"}
          </button>
          {onApproveTaxProfile && (
            <button
              type="button"
              className={styles.approveBtn}
              onClick={() => onApproveTaxProfile(supplier.supplierId)}
            >
              ✓ Approve Profile
            </button>
          )}
        </div>
      </header>

      {/* Tax Identification Details Ribbon */}
      <div className={styles.detailsRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Tax Identifier Type</span>
          <span className={styles.ribbonValue}>{supplier.taxIdType}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Tax ID Number</span>
          <span className={styles.ribbonMono}>
            {supplier.taxIdentificationNumber}
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Statutory Withholding Rate</span>
          <span className={styles.ribbonValue}>
            {supplier.withholdingTaxRatePct.toFixed(1)}%
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Last VIES / TIN Audit</span>
          <span className={styles.ribbonValue}>
            {supplier.viesValidationTimestamp
              ? new Date(supplier.viesValidationTimestamp).toLocaleDateString()
              : "Never Verified"}
          </span>
        </div>
      </div>

      {/* Certificates & Documentation Table */}
      <div className={styles.certificatesPane}>
        <div className={styles.paneHeader}>
          <h3 className={styles.paneTitle}>Exemption Certificates &amp; Signed Forms</h3>
          {onUploadCertificate && (
            <button
              type="button"
              className={styles.uploadBtn}
              onClick={() => onUploadCertificate(supplier.supplierId)}
            >
              + Upload Certificate
            </button>
          )}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className={styles.srOnly}>
              Tax documents and certificates for {supplier.legalName}
            </caption>
            <thead>
              <tr>
                <th scope="col">Document Type</th>
                <th scope="col">File Attachment</th>
                <th scope="col">Uploaded Date</th>
                <th scope="col">Expiry Date</th>
                <th scope="col">Compliance Verification</th>
              </tr>
            </thead>
            <tbody>
              {supplier.certificates.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyCell}>
                    No certificates or W-9/W-8 forms on file. Withholding defaults to 30%.
                  </td>
                </tr>
              ) : (
                supplier.certificates.map((cert) => (
                  <tr key={cert.id} className={styles.tableRow}>
                    <td>
                      <span className={styles.docTypeBadge}>{cert.documentType}</span>
                    </td>
                    <td className={styles.fileCell}>
                      📄 <span>{cert.fileReference}</span>
                    </td>
                    <td>{cert.uploadedAt}</td>
                    <td>{cert.expiryDate || "Indefinite"}</td>
                    <td>
                      <span
                        className={`${styles.certStatus} ${
                          cert.verifiedByCompliance
                            ? styles.certVerified
                            : styles.certPending
                        }`}
                      >
                        {cert.verifiedByCompliance ? "✓ Verified" : "⏳ Review Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Audit Notes */}
      {supplier.auditNotes && (
        <div className={styles.notesBox}>
          <span className={styles.notesLabel}>Compliance Officer Notes:</span>
          <p className={styles.notesText}>{supplier.auditNotes}</p>
        </div>
      )}
    </section>
  );
};
