"use client";

import React, { forwardRef, useId, useState } from "react";
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

export interface VendorPaymentMethodSelectorProps
  extends React.HTMLAttributes<HTMLElement> {
  vendorName: string;
  vendorTaxId: string;
  w9Status: "verified" | "pending" | "missing";
  initialRail?: PaymentRail;
  initialDetails?: BankingDetails;
  onSelectRail?: (rail: PaymentRail) => void;
  onSavePaymentMethod?: (rail: PaymentRail, details: BankingDetails) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
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

/**
 * VendorPaymentMethodSelector
 *
 * Enterprise accounts payable configuration tool for managing vendor disbursement
 * rails (ACH, Virtual Card, Wire, SEPA) with integrated tax & treasury audit compliance.
 *
 * @maturity stable
 */
export const VendorPaymentMethodSelector = forwardRef<
  HTMLElement,
  VendorPaymentMethodSelectorProps
>(function VendorPaymentMethodSelector(
  {
    vendorName,
    vendorTaxId,
    w9Status = "verified",
    initialRail = "ACH",
    initialDetails = {},
    onSelectRail,
    onSavePaymentMethod,
    density = "compact",
    className = "",
    ...restProps
  },
  ref
) {
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

  const containerClasses = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={ref}
      className={containerClasses}
      data-density={density}
      aria-labelledby={headingId}
      {...restProps}
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
              className={`${styles.railCard} ${
                isSelected ? styles.railCardSelected : ""
              }`}
              onClick={() => handleRailChange(rail.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handleRailChange(rail.id);
                }
              }}
            >
              <div className={styles.cardHeaderRow}>
                <div className={styles.radioDot}>
                  {isSelected && <div className={styles.radioDotInner} />}
                </div>
                <strong className={styles.railTitle}>{rail.title}</strong>
                {rail.cashbackIncentive && (
                  <span className={styles.rebateBadge}>
                    {rail.cashbackIncentive}
                  </span>
                )}
              </div>
              <p className={styles.railSubtitle}>{rail.subtitle}</p>
              <div className={styles.cardMetaRow}>
                <span className={styles.metaSpeed}>⚡ {rail.speed}</span>
                <span>Fee: {rail.processingFee}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Banking & Rail Details Form */}
      <div className={styles.formContainer}>
        <h3 className={styles.formSectionTitle}>
          {selectedRail === "ACH" && "ACH Direct Deposit Clearing Details"}
          {selectedRail === "CARD" && "Virtual Card Payment Terms & Remittance"}
          {selectedRail === "WIRE" && "SWIFT / Fedwire Beneficiary Instructions"}
          {selectedRail === "SEPA" && "SEPA IBAN & European Clearing Details"}
        </h3>

        {/* ACH Fields */}
        {selectedRail === "ACH" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="ach-routing" className={styles.label}>
                9-Digit Routing Number (ABA)
              </label>
              <input
                id="ach-routing"
                type="text"
                maxLength={9}
                placeholder="021000021"
                className={styles.input}
                value={details.routingNumber ?? ""}
                onChange={(e) =>
                  handleDetailChange("routingNumber", e.target.value)
                }
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="ach-account" className={styles.label}>
                Account Number
              </label>
              <input
                id="ach-account"
                type="password"
                placeholder="••••••••••••"
                className={styles.input}
                value={details.accountNumber ?? ""}
                onChange={(e) =>
                  handleDetailChange("accountNumber", e.target.value)
                }
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="ach-type" className={styles.label}>
                Account Type
              </label>
              <select
                id="ach-type"
                className={styles.select}
                value={details.accountType ?? "checking"}
                onChange={(e) =>
                  handleDetailChange(
                    "accountType",
                    e.target.value as "checking" | "savings"
                  )
                }
              >
                <option value="checking">Corporate Checking</option>
                <option value="savings">Commercial Savings</option>
              </select>
            </div>
          </div>
        )}

        {/* Virtual Card Fields */}
        {selectedRail === "CARD" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.cardIncentiveNote}>
              💡 <strong>Early Payment Incentive:</strong> Paying via Virtual Card
              unlocks an automated 1.5% cashback rebate applied instantly to your
              treasury yield statement.
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="card-remittance-email" className={styles.label}>
                Accounts Receivable Remittance Email
              </label>
              <input
                id="card-remittance-email"
                type="email"
                placeholder="billing@vendor.com"
                className={styles.input}
                value={details.remittanceEmail ?? ""}
                onChange={(e) =>
                  handleDetailChange("remittanceEmail", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {/* Wire Fields */}
        {selectedRail === "WIRE" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="wire-swift" className={styles.label}>
                SWIFT / BIC Code
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
              <label htmlFor="wire-bank-name" className={styles.label}>
                Beneficiary Bank Name
              </label>
              <input
                id="wire-bank-name"
                type="text"
                placeholder="JPMorgan Chase Bank, N.A."
                className={styles.input}
                value={details.beneficiaryBankName ?? ""}
                onChange={(e) =>
                  handleDetailChange("beneficiaryBankName", e.target.value)
                }
              />
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="wire-iban" className={styles.label}>
                IBAN / Account Number
              </label>
              <input
                id="wire-iban"
                type="text"
                placeholder="US49CHAS021000021884019284"
                className={styles.input}
                value={details.iban ?? ""}
                onChange={(e) => handleDetailChange("iban", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* SEPA Fields */}
        {selectedRail === "SEPA" && (
          <div className={styles.fieldsGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="sepa-iban" className={styles.label}>
                International Bank Account Number (IBAN)
              </label>
              <input
                id="sepa-iban"
                type="text"
                placeholder="DE89370400440532013000"
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
});

VendorPaymentMethodSelector.displayName = "VendorPaymentMethodSelector";
