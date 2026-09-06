import React, { useId, useState } from "react";
import styles from "./enterprise-checkout-address-validator.module.css";

export interface PostalAddress {
  companyName?: string;
  attentionName?: string;
  street1: string; // "500 Howard Street"
  street2?: string; // "Suite 400"
  city: string; // "San Francisco"
  state: string; // "CA"
  postalCode: string; // "94105"
  country: string; // "United States"
  isCommercial?: boolean;
}

export interface StandardizedAddressSuggestion extends PostalAddress {
  dpvConfirmed: boolean;
  standardizedPostalCode: string; // "94105-1204"
  standardizedStreet1: string; // "500 HOWARD ST"
  standardizedStreet2?: string; // "STE 400"
  carrierRoute?: string; // "C004"
}

export interface EnterpriseCheckoutAddressValidatorProps {
  initialAddress?: Partial<PostalAddress>;
  mockSuggestion?: StandardizedAddressSuggestion;
  onConfirmAddress?: (address: PostalAddress) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

const defaultSuggestion: StandardizedAddressSuggestion = {
  companyName: "UniERP Systems Inc.",
  attentionName: "Elena Rostova",
  street1: "500 Howard Street",
  street2: "Suite 400",
  standardizedStreet1: "500 HOWARD ST",
  standardizedStreet2: "STE 400",
  city: "SAN FRANCISCO",
  state: "CA",
  postalCode: "94105",
  standardizedPostalCode: "94105-1204",
  country: "United States",
  dpvConfirmed: true,
  isCommercial: true,
  carrierRoute: "C004",
};

export const EnterpriseCheckoutAddressValidator: React.FC<
  EnterpriseCheckoutAddressValidatorProps
> = ({
  initialAddress = {
    companyName: "UniERP Systems Inc.",
    attentionName: "Elena Rostova",
    street1: "500 Howard Street",
    street2: "Suite 400",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "United States",
  },
  mockSuggestion = defaultSuggestion,
  onConfirmAddress,
  density = "compact",
  className = "",
}) => {
  const formId = useId();
  const [address, setAddress] = useState<PostalAddress>({
    companyName: initialAddress.companyName ?? "",
    attentionName: initialAddress.attentionName ?? "",
    street1: initialAddress.street1 ?? "",
    street2: initialAddress.street2 ?? "",
    city: initialAddress.city ?? "",
    state: initialAddress.state ?? "",
    postalCode: initialAddress.postalCode ?? "",
    country: initialAddress.country ?? "United States",
  });

  const [validationState, setValidationState] = useState<"idle" | "suggesting" | "confirmed">("idle");
  const [suggestedAddress, setSuggestedAddress] = useState<StandardizedAddressSuggestion | null>(null);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestedAddress(mockSuggestion);
    setValidationState("suggesting");
  };

  const handleAcceptStandardized = () => {
    if (!suggestedAddress) return;
    const resolved: PostalAddress = {
      ...address,
      street1: suggestedAddress.standardizedStreet1,
      street2: suggestedAddress.standardizedStreet2,
      city: suggestedAddress.city,
      state: suggestedAddress.state,
      postalCode: suggestedAddress.standardizedPostalCode,
    };
    setAddress(resolved);
    setValidationState("confirmed");
    onConfirmAddress?.(resolved);
  };

  const handleKeepEntered = () => {
    setValidationState("confirmed");
    onConfirmAddress?.(address);
  };

  return (
    <section
      className={`${styles.container} ${className}`}
      data-density={density}
      aria-label="Enterprise Shipping & Billing Address Validator"
    >
      <header className={styles.header}>
        <div className={styles.titleCol}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>USPS CASS CERTIFIED VALIDATION</span>
            <span className={styles.carrierBadge}>DPV 100% Delivery Confidence</span>
          </div>
          <h2 className={styles.title}>Commercial Delivery Point Address Normalization</h2>
          <p className={styles.subtitle}>
            Standardizes address formatting to prevent carrier freight re-routing penalties
          </p>
        </div>
      </header>

      <form onSubmit={handleValidate} className={styles.formBody}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Destination Consignee Information</legend>

          <div className={styles.rowTwoCol}>
            <div className={styles.formGroup}>
              <label htmlFor={`${formId}-company`} className={styles.label}>
                Company / Organization Name
              </label>
              <input
                id={`${formId}-company`}
                type="text"
                className={styles.input}
                value={address.companyName}
                onChange={(e) => setAddress({ ...address, companyName: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`${formId}-attn`} className={styles.label}>
                Attention / Consignee Recipient
              </label>
              <input
                id={`${formId}-attn`}
                type="text"
                className={styles.input}
                value={address.attentionName}
                onChange={(e) => setAddress({ ...address, attentionName: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={`${formId}-street1`} className={styles.label}>
              Delivery Street Address <span className={styles.required}>*</span>
            </label>
            <input
              id={`${formId}-street1`}
              type="text"
              required
              className={styles.input}
              value={address.street1}
              onChange={(e) => setAddress({ ...address, street1: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor={`${formId}-street2`} className={styles.label}>
              Apartment, Suite, Unit, or Dock #
            </label>
            <input
              id={`${formId}-street2`}
              type="text"
              className={styles.input}
              value={address.street2}
              onChange={(e) => setAddress({ ...address, street2: e.target.value })}
            />
          </div>

          <div className={styles.rowThreeCol}>
            <div className={styles.formGroup}>
              <label htmlFor={`${formId}-city`} className={styles.label}>
                City <span className={styles.required}>*</span>
              </label>
              <input
                id={`${formId}-city`}
                type="text"
                required
                className={styles.input}
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`${formId}-state`} className={styles.label}>
                State / Province <span className={styles.required}>*</span>
              </label>
              <input
                id={`${formId}-state`}
                type="text"
                required
                className={styles.input}
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor={`${formId}-postal`} className={styles.label}>
                Postal Code <span className={styles.required}>*</span>
              </label>
              <input
                id={`${formId}-postal`}
                type="text"
                required
                className={styles.input}
                value={address.postalCode}
                onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              />
            </div>
          </div>
        </fieldset>

        {validationState === "idle" && (
          <div className={styles.actionRow}>
            <button type="submit" className={styles.validateButton}>
              Verify & Standardize Address
            </button>
          </div>
        )}

        {/* Suggestion Card */}
        {validationState === "suggesting" && suggestedAddress && (
          <div className={styles.suggestionModal} aria-live="polite">
            <div className={styles.suggestionHeader}>
              <strong className={styles.suggestionTitle}>Postal Standardization Match Found</strong>
              <span className={styles.dpvBadge}>DPV Confirmed Commercial</span>
            </div>

            <div className={styles.comparisonGrid}>
              <div className={styles.compareCard}>
                <span className={styles.compareLabel}>As Entered:</span>
                <p className={styles.compareAddress}>
                  {address.street1} {address.street2}
                  <br />
                  {address.city}, {address.state} {address.postalCode}
                </p>
              </div>

              <div className={`${styles.compareCard} ${styles.standardizedMatch}`}>
                <span className={styles.compareLabelRecommended}>
                  ★ Standardized Postal Clean (Recommended):
                </span>
                <p className={styles.compareAddressHighlight}>
                  {suggestedAddress.standardizedStreet1} {suggestedAddress.standardizedStreet2}
                  <br />
                  {suggestedAddress.city}, {suggestedAddress.state}{" "}
                  <strong>{suggestedAddress.standardizedPostalCode}</strong>
                </p>
                <div className={styles.routeTag}>Carrier Route: {suggestedAddress.carrierRoute}</div>
              </div>
            </div>

            <div className={styles.decisionActions}>
              <button
                type="button"
                className={styles.acceptBtn}
                onClick={handleAcceptStandardized}
              >
                Use Standardized Address (Recommended)
              </button>
              <button
                type="button"
                className={styles.keepEnteredBtn}
                onClick={handleKeepEntered}
              >
                Keep As Entered
              </button>
            </div>
          </div>
        )}

        {validationState === "confirmed" && (
          <div className={styles.confirmedBox}>
            <span className={styles.confirmedCheck}>✓</span>
            <div>
              <strong>Address Verified & Confirmed</strong>
              <p className={styles.confirmedDetail}>
                {address.street1}, {address.city}, {address.state} {address.postalCode}
              </p>
            </div>
          </div>
        )}
      </form>
    </section>
  );
};
