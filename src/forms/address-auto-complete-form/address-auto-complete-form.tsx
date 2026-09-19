"use client";

import {
  useState,
  useId,
  forwardRef,
  type FormEvent,
  type HTMLAttributes,
  type ChangeEvent,
} from "react";
import styles from "./address-auto-complete-form.module.css";

export interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AddressAutoCompleteFormProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  defaultCountry?: string;
  initialAddress?: Partial<AddressData>;
  suggestions?: string[];
  onSearchSuggestions?: (query: string) => void;
  onSubmit?: (address: AddressData) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * `<AddressAutoCompleteForm>` collects and validates multi-regional postal locations
 * with predictive autocomplete hooks for logistics and vendor setups.
 *
 * @maturity stable
 */
export const AddressAutoCompleteForm = forwardRef<
  HTMLDivElement,
  AddressAutoCompleteFormProps
>(
  (
    {
      defaultCountry = "US",
      initialAddress,
      suggestions = [],
      onSearchSuggestions,
      onSubmit,
      title = "Shipping Address",
      subtitle,
      className = "",
      ...restProps
    },
    ref
  ) => {
    const idPrefix = useId();
    const [line1, setLine1] = useState(initialAddress?.line1 ?? "");
    const [line2, setLine2] = useState(initialAddress?.line2 ?? "");
    const [city, setCity] = useState(initialAddress?.city ?? "");
    const [state, setState] = useState(initialAddress?.state ?? "");
    const [postalCode, setPostalCode] = useState(initialAddress?.postalCode ?? "");
    const [country, setCountry] = useState(initialAddress?.country ?? defaultCountry);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleLine1Change = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setLine1(val);
      if (onSearchSuggestions) {
        onSearchSuggestions(val);
        setShowSuggestions(val.length > 2);
      }
    };

    const handleSelectSuggestion = (suggestion: string) => {
      setLine1(suggestion);
      setShowSuggestions(false);
    };

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit?.({
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
      });
    };

    return (
      <div
        ref={ref}
        className={`${styles.container} ${className}`.trim()}
        role="region"
        aria-label={title}
        {...restProps}
      >
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>{title}</h3>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        <form className={styles.content} onSubmit={handleSubmit} noValidate>
          <div className={styles.fieldGroup}>
            <label htmlFor={`${idPrefix}-line1`} className={styles.fieldLabel}>
              Address Line 1
            </label>
            <input
              id={`${idPrefix}-line1`}
              className={styles.input}
              placeholder="Street address, P.O. box, company name"
              value={line1}
              onChange={handleLine1Change}
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestionsList} role="listbox" aria-label="Address suggestions">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    role="option"
                    aria-selected={false}
                    className={styles.suggestionItem}
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={`${idPrefix}-line2`} className={styles.fieldLabel}>
              Address Line 2 (Optional)
            </label>
            <input
              id={`${idPrefix}-line2`}
              className={styles.input}
              placeholder="Apartment, suite, unit, building, floor, etc."
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "var(--space-3)" }}>
            <div className={styles.fieldGroup}>
              <label htmlFor={`${idPrefix}-city`} className={styles.fieldLabel}>
                City
              </label>
              <input
                id={`${idPrefix}-city`}
                className={styles.input}
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${idPrefix}-state`} className={styles.fieldLabel}>
                State / Province
              </label>
              <input
                id={`${idPrefix}-state`}
                className={styles.input}
                placeholder="State / Region"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor={`${idPrefix}-postal`} className={styles.fieldLabel}>
                Postal Code
              </label>
              <input
                id={`${idPrefix}-postal`}
                className={styles.input}
                placeholder="ZIP / Postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor={`${idPrefix}-country`} className={styles.fieldLabel}>
              Country / Region
            </label>
            <select
              id={`${idPrefix}-country`}
              className={styles.select}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IN">India</option>
              <option value="AU">Australia</option>
              <option value="SG">Singapore</option>
              <option value="JP">Japan</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBlockStart: "var(--space-2)" }}>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
              Save Address
            </button>
          </div>
        </form>
      </div>
    );
  }
);

AddressAutoCompleteForm.displayName = "AddressAutoCompleteForm";
