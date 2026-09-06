"use client";

import React from "react";
import styles from "./address-auto-complete-form.module.css";

export interface AddressAutoCompleteFormProps { defaultCountry?: string; onSubmit?: (address: AddressData) => void; }
export interface AddressData { line1: string; line2?: string; city: string; state: string; postalCode: string; country: string; }

export const AddressAutoCompleteForm: React.FC<AddressAutoCompleteFormProps> = (props) => {
  const { defaultCountry = 'US', onSubmit } = props;
  return (
    <div className={styles.container} role="form" aria-label="Address form">
      <h3 className={styles.title}>Shipping Address</h3>
      <div className={styles.content}>
        <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Address Line 1</label><input className={styles.input} placeholder="123 Main St" aria-label="Address line 1" /></div>
        <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Address Line 2</label><input className={styles.input} placeholder="Apt, Suite, Unit" aria-label="Address line 2" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 'var(--space-3)' }}>
          <div className={styles.fieldGroup}><label className={styles.fieldLabel}>City</label><input className={styles.input} placeholder="City" aria-label="City" /></div>
          <div className={styles.fieldGroup}><label className={styles.fieldLabel}>State</label><input className={styles.input} placeholder="State" aria-label="State" /></div>
          <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Postal Code</label><input className={styles.input} placeholder="ZIP" aria-label="Postal code" /></div>
        </div>
        <div className={styles.fieldGroup}><label className={styles.fieldLabel}>Country</label><select className={styles.select} defaultValue={defaultCountry} aria-label="Country"><option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option><option value="IN">India</option></select></div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onSubmit?.({ line1: '', city: '', state: '', postalCode: '', country: defaultCountry })}>Save Address</button>
      </div>
    </div>
  );
};
