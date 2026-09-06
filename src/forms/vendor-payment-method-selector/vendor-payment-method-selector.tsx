import React, { useId, useState } from "react";
import styles from "./vendor-payment-method-selector.module.css";

export type PaymentRail = "ACH" | "WIRE" | "CARD" | "SEPA" | "CHECK";

export interface RailOption {
  id: PaymentRail;
  title: string;
  subtitle: string;
  speed: string;
  processingFee: string;
  cashbackIncentive?: string;
}

export interface BankingDetails {
  routingNumber?: string;
  accountNumber?: string;
  accountType?: "checking" | "savings";
  swiftBic?: string;
  iban?: string;
  beneficiaryBankName?: string;
  remittanceEmail?: string;
}

export interface VendorPaymentMethodSelectorProps {
  vendorName: string; // "Apex Industrial Automation LLC"
  vendorTaxId: string; // "XX-XXX4910"
  w9Status: "verified" | "pending" | "missing";
  initialRail?: PaymentRail;
  initialDetails?: BankingDetails;
  onSelectRail?: (rail: PaymentRail) => void;
  onSavePaymentMethod?: (rail: PaymentRail, details: BankingDetails) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const DEFAULT_RAILS: RailOption[] = [
  {
    id: "ACH",
    title: "Direct Deposit (ACH)",
    subtitle: "Direct bank transfer to US checking or savings accounts",
    speed: "1-2 Business Days",
    processingFee: "$0.00 (Free)",
  },
  {
    id: "CARD",
    title: "Virtual Commercial Card",
    subtitle: "Instant single-use virtual Mastercard with invoice reconciliation",
    speed: "Instantaneous",
    processingFee: "$0.00 (Free)",
    cashbackIncentive: "+1.5% Early Payment Rebate",
  },
  {
    id: "WIRE",
    title: "Domestic & SWIFT Wire Transfer",
    subtitle: "High-value real-time gross settlement for urgent disbursements",
    speed: "Same Day",
    processingFee: "$15.00 flat fee",
  },
  {
    id: "SEPA",
    title: "Euro SEPA Credit Transfer",
    subtitle: "Euro denominated pan-European bank settlement",
    speed: "1 Business Day",
    processingFee: "€0.20 per transfer",
  },
];

export const VendorPaymentMethodSelector: React.FC<VendorPaymentMethodSelectorProps> = ({
  vendorName,
  vendorTaxId,
  w9Status = "verified",
  initialRail = "ACH",
  initialDetails = {},
  onSelectRail,
  onSavePaymentMethod,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [selectedRail, setSelectedRail] = useState<PaymentRail>(initialRail);
  const [details, setDetails] = useState<BankingDetails>(initialDetails);

  const handleRailChange = (rail: PaymentRail) => {
    setSelectedRail(rail);
    onSelectRail?.(rail);
  };

  const handleDetailChange = (field: keyof BankingDetails, val: string) => {
    setDetails((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-labelledby={headingId}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.metaRow}>
            <span className={styles.vendorTaxBadge}>Tax ID: {vendorTaxId}</span>
            <span
              className={`${styles.w9Badge} ${
                w9Status === "verified" ? styles.w9Verified : styles.w9Pending
              }`}
            >
              W-9: {w9Status.toUpperCase()}
            </span>
            <span className={styles.ofacBadge}>OFAC SDN: PASSED</span>
          </div>
          <h2 id={headingId} className={styles.title}>
            Disbursement Rail & Banking Configuration: {vendorName}
          </h2>
          <p className={styles.subtitle}>
            Select primary disbursement rail and maintain audited treasury routing details.
          </p>
        </div>
      </header>

      {/* Rail Selection Radio Cards */}
      <div className={styles.railsGrid} role="radiogroup" aria-labelledby={headingId}>
        {DEFAULT_RAILS.map((rail) => {
          const isSelected = selectedRail === rail.id;
          return (
            <div
              key={rail.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`${styles.railCard} ${isSelected ? styles.railCardSelected : ""}`}
              onClick={() => handleRailChange(rail.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRailChange(rail.id);
                }
              }}
            >
              <div className={styles.cardHeaderRow}>
                <span className={styles.radioDot}>
                  {isSelected && <span className={styles.radioDotInner} />}
                </span>
                <strong className={styles.railTitle}>{rail.title}</strong>
                {rail.cashbackIncentive && (
                  <span className={styles.rebateBadge}>{rail.cashbackIncentive}</span>
                )}
              </div>
              <p className={styles.railSubtitle}>{rail.subtitle}</p>
              <div className={styles.cardMetaRow}>
                <span className={styles.metaSpeed}>⏱ {rail.speed}</span>
                <span className={styles.metaFee}>Fee: {rail.processingFee}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Banking Details Form */}
      <div className={styles.formContainer}>
        <h3 className={styles.formSectionTitle}>
          Banking & Routing Credentials ({selectedRail})
        </h3>

        {selectedRail === "ACH" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="vendor-routing" className={styles.label}>
                Routing / ABA Transit Number (9 Digits)
              </label>
              <input
                id="vendor-routing"
                type="text"
                maxLength={9}
                placeholder="021000021"
                className={styles.input}
                value={details.routingNumber ?? ""}
                onChange={(e) => handleDetailChange("routingNumber", e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="vendor-account" className={styles.label}>
                Account Number
              </label>
              <input
                id="vendor-account"
                type="password"
                placeholder="••••••••••"
                className={styles.input}
                value={details.accountNumber ?? ""}
                onChange={(e) => handleDetailChange("accountNumber", e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="vendor-account-type" className={styles.label}>
                Account Classification
              </label>
              <select
                id="vendor-account-type"
                className={styles.select}
                value={details.accountType ?? "checking"}
                onChange={(e) => handleDetailChange("accountType", e.target.value)}
              >
                <option value="checking">Commercial Checking Account</option>
                <option value="savings">Treasury Savings Account</option>
              </select>
            </div>
          </div>
        )}

        {selectedRail === "CARD" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="vendor-card-email" className={styles.label}>
                Accounts Receivable Remittance Email
              </label>
              <input
                id="vendor-card-email"
                type="email"
                placeholder="ap-remittance@vendor.com"
                className={styles.input}
                value={details.remittanceEmail ?? ""}
                onChange={(e) => handleDetailChange("remittanceEmail", e.target.value)}
              />
            </div>
            <div className={styles.cardIncentiveNote}>
              <strong>Automatic 1.5% Early Pay Cash Rebate:</strong> Supplier receives instant payment notification with tokenized 16-digit card number and CVV2. Your organization retains 1.5% net spend volume rebate.
            </div>
          </div>
        )}

        {selectedRail === "WIRE" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="wire-swift" className={styles.label}>
                SWIFT / BIC Code (8 or 11 Characters)
              </label>
              <input
                id="wire-swift"
                type="text"
                placeholder="CHASUS33XXX"
                className={styles.input}
                value={details.swiftBic ?? ""}
                onChange={(e) => handleDetailChange("swiftBic", e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="wire-beneficiary-bank" className={styles.label}>
                Beneficiary Bank Name
              </label>
              <input
                id="wire-beneficiary-bank"
                type="text"
                placeholder="JPMorgan Chase Bank, N.A."
                className={styles.input}
                value={details.beneficiaryBankName ?? ""}
                onChange={(e) => handleDetailChange("beneficiaryBankName", e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="wire-account-num" className={styles.label}>
                Beneficiary Account / IBAN
              </label>
              <input
                id="wire-account-num"
                type="text"
                placeholder="Account or IBAN"
                className={styles.input}
                value={details.iban ?? details.accountNumber ?? ""}
                onChange={(e) => handleDetailChange("iban", e.target.value)}
              />
            </div>
          </div>
        )}

        {selectedRail === "SEPA" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="sepa-iban" className={styles.label}>
                International Bank Account Number (IBAN)
              </label>
              <input
                id="sepa-iban"
                type="text"
                placeholder="DE89 3704 0044 0532 0130 00"
                className={styles.input}
                value={details.iban ?? ""}
                onChange={(e) => handleDetailChange("iban", e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="sepa-bic" className={styles.label}>
                Bank Identifier Code (BIC)
              </label>
              <input
                id="sepa-bic"
                type="text"
                placeholder="DEUTDEDBFXX"
                className={styles.input}
                value={details.swiftBic ?? ""}
                onChange={(e) => handleDetailChange("swiftBic", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {onSavePaymentMethod && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.saveButton}
              onClick={() => onSavePaymentMethod(selectedRail, details)}
            >
              Confirm & Save Payment Rail
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
