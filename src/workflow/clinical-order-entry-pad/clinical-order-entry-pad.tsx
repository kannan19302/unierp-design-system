import React, { useId, useState } from "react";
import styles from "./clinical-order-entry-pad.module.css";

export type OrderCategory = "medication" | "lab" | "imaging" | "nursing" | "consult";
export type OrderPriority = "routine" | "urgent" | "stat";

export interface StagedClinicalOrder {
  id: string;
  category: OrderCategory;
  orderName: string; // e.g. "Piperacillin-Tazobactam IV (Zosyn)"
  details: string; // "3.375g IV q8h over 4 hours"
  priority: OrderPriority;
  requiresCosignature?: boolean;
  contraindicationWarning?: string;
}

export interface PatientBannerInfo {
  mrn: string;
  fullName: string;
  age: number;
  gender: string;
  roomBed: string; // e.g. "ICU-04"
  allergies: string[];
  weightKg: number;
}

export interface ClinicalOrderEntryPadProps {
  patient: PatientBannerInfo;
  attendingPhysician?: string;
  physicianNpi?: string;
  initialOrders?: StagedClinicalOrder[];
  onSubmitOrders?: (orders: StagedClinicalOrder[], signaturePin: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ClinicalOrderEntryPad: React.FC<ClinicalOrderEntryPadProps> = ({
  patient,
  attendingPhysician = "Dr. Marcus Thorne, MD (Critical Care / Pulmonology)",
  physicianNpi = "NPI-9940182741",
  initialOrders = [],
  onSubmitOrders,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [stagedOrders, setStagedOrders] = useState<StagedClinicalOrder[]>(initialOrders);
  const [activeCategory, setActiveCategory] = useState<OrderCategory>("medication");
  const [signaturePin, setSignaturePin] = useState<string>("");
  const [signed, setSigned] = useState<boolean>(false);
  const [overrideAcknowledged, setOverrideAcknowledged] = useState<boolean>(false);

  // New order form inputs
  const [newOrderName, setNewOrderName] = useState<string>("");
  const [newOrderDetails, setNewOrderDetails] = useState<string>("");
  const [newOrderPriority, setNewOrderPriority] = useState<OrderPriority>("routine");

  const hasContraindications = stagedOrders.some((o) => !!o.contraindicationWarning);

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderName.trim()) return;

    // Check for drug allergy contraindication
    const nameLower = newOrderName.toLowerCase();
    let warning: string | undefined;
    patient.allergies.forEach((allergy) => {
      if (nameLower.includes(allergy.toLowerCase())) {
        warning = `CRITICAL CONTRAINDICATION: Patient allergic to ${allergy.toUpperCase()}.`;
      }
    });

    const newOrder: StagedClinicalOrder = {
      id: `ord-${Date.now()}`,
      category: activeCategory,
      orderName: newOrderName.trim(),
      details: newOrderDetails.trim() || "As directed by standard ICU protocol",
      priority: newOrderPriority,
      contraindicationWarning: warning,
    };

    setStagedOrders([...stagedOrders, newOrder]);
    setNewOrderName("");
    setNewOrderDetails("");
    setNewOrderPriority("routine");
  };

  const handleRemoveOrder = (id: string) => {
    setStagedOrders(stagedOrders.filter((o) => o.id !== id));
  };

  const handleSignAndSubmit = () => {
    if (!signaturePin) return;
    setSigned(true);
    onSubmitOrders?.(stagedOrders, signaturePin);
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Patient Clinical Safety Banner */}
      <header className={styles.patientBanner}>
        <div className={styles.patientPrimary}>
          <span className={styles.bedBadge}>{patient.roomBed}</span>
          <div>
            <h2 id={headingId} className={styles.patientName}>
              {patient.fullName}
            </h2>
            <div className={styles.patientMeta}>
              <span>MRN: {patient.mrn}</span>
              <span>•</span>
              <span>
                {patient.age}y {patient.gender}
              </span>
              <span>•</span>
              <span>Weight: {patient.weightKg} kg</span>
            </div>
          </div>
        </div>

        {/* Severe Allergy Corridor */}
        <div className={styles.allergyCorridor}>
          <span className={styles.allergyLabel}>⚠️ RECORDED ALLERGIES:</span>
          <div className={styles.allergyTags}>
            {patient.allergies.length > 0 ? (
              patient.allergies.map((allergy) => (
                <span key={allergy} className={styles.allergyBadge}>
                  {allergy.toUpperCase()}
                </span>
              ))
            ) : (
              <span className={styles.noAllergies}>No Known Drug Allergies (NKDA)</span>
            )}
          </div>
        </div>
      </header>

      {/* Contraindication Alert Banner */}
      {hasContraindications && (
        <div className={styles.contraindicationAlert} role="alert">
          <span className={styles.alertIcon} aria-hidden="true">⛔</span>
          <div className={styles.alertText}>
            <strong>CRITICAL CLINICAL DECISION SUPPORT ALERT:</strong> One or more staged orders conflict with recorded patient allergy contraindications. An explicit attending physician override is legally required to sign.
            <div className={styles.overrideCheckWrap}>
              <label className={styles.overrideLabel}>
                <input
                  type="checkbox"
                  checked={overrideAcknowledged}
                  onChange={(e) => setOverrideAcknowledged(e.target.checked)}
                />
                I acknowledge the clinical risk and certify medical necessity override.
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Order Entry Grid */}
      <div className={styles.orderGrid}>
        {/* Order Composition Area */}
        <div className={styles.entryPane}>
          <h3 className={styles.paneTitle}>Clinical Order Composition</h3>

          {/* Category Tabs */}
          <div className={styles.categoryTabs} role="tablist" aria-label="Order categories">
            {(["medication", "lab", "imaging", "nursing", "consult"] as OrderCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`${styles.catTab} ${
                    activeCategory === cat ? styles.catTabActive : ""
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat.toUpperCase()}
                </button>
              )
            )}
          </div>

          {/* New Order Form */}
          <form className={styles.orderForm} onSubmit={handleAddOrder}>
            <div className={styles.formRow}>
              <div className={styles.inputWrap}>
                <label htmlFor={`${headingId}-order-name`} className={styles.label}>
                  Order Description / Drug Formulation:
                </label>
                <input
                  id={`${headingId}-order-name`}
                  type="text"
                  className={styles.textInput}
                  placeholder="e.g. Vancomycin IV, CT Chest w/ Contrast, BMP..."
                  value={newOrderName}
                  onChange={(e) => setNewOrderName(e.target.value)}
                />
              </div>

              <div className={styles.inputWrapNarrow}>
                <label htmlFor={`${headingId}-priority`} className={styles.label}>
                  Acuity Priority:
                </label>
                <select
                  id={`${headingId}-priority`}
                  className={styles.selectInput}
                  value={newOrderPriority}
                  onChange={(e) => setNewOrderPriority(e.target.value as OrderPriority)}
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="stat">STAT (Emergency)</option>
                </select>
              </div>
            </div>

            <div className={styles.inputWrap}>
              <label htmlFor={`${headingId}-details`} className={styles.label}>
                Dosing, Route, Frequency &amp; Clinical Instructions:
              </label>
              <input
                id={`${headingId}-details`}
                type="text"
                className={styles.textInput}
                placeholder="e.g. 15 mg/kg IV q12h; trough before 4th dose"
                value={newOrderDetails}
                onChange={(e) => setNewOrderDetails(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.addOrderBtn}>
              + Stage Order in Basket
            </button>
          </form>
        </div>

        {/* Staging Basket */}
        <div className={styles.basketPane}>
          <div className={styles.basketHeader}>
            <h3 className={styles.paneTitle}>
              Staged Orders Basket ({stagedOrders.length})
            </h3>
          </div>

          <div className={styles.orderList}>
            {stagedOrders.length === 0 ? (
              <p className={styles.emptyBasket}>
                No orders currently staged. Compose orders on the left.
              </p>
            ) : (
              stagedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`${styles.orderCard} ${
                    order.contraindicationWarning ? styles.cardContraindicated : ""
                  }`}
                >
                  <div className={styles.orderCardHeader}>
                    <span className={styles.orderCatBadge}>
                      {order.category.toUpperCase()}
                    </span>
                    <span
                      className={`${styles.prioBadge} ${
                        order.priority === "stat"
                          ? styles.prioStat
                          : order.priority === "urgent"
                          ? styles.prioUrgent
                          : styles.prioRoutine
                      }`}
                    >
                      {order.priority.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemoveOrder(order.id)}
                      aria-label={`Remove order: ${order.orderName}`}
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className={styles.orderCardName}>{order.orderName}</h4>
                  <p className={styles.orderCardDetails}>{order.details}</p>
                  {order.contraindicationWarning && (
                    <div className={styles.contraWarningText}>
                      ⚠️ {order.contraindicationWarning}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Physician Electronic Signature Footer */}
      <footer className={styles.signOffFooter}>
        <div className={styles.providerInfo}>
          <span className={styles.providerName}>{attendingPhysician}</span>
          <span className={styles.credentialsBadge}>{physicianNpi}</span>
        </div>

        <div className={styles.signActionGroup}>
          <label htmlFor={`${headingId}-pin`} className={styles.pinLabel}>
            E-Sign PIN:
          </label>
          <input
            id={`${headingId}-pin`}
            type="password"
            maxLength={6}
            placeholder="••••"
            className={styles.pinInput}
            value={signaturePin}
            onChange={(e) => setSignaturePin(e.target.value)}
          />
          <button
            type="button"
            className={styles.submitOrdersBtn}
            disabled={
              stagedOrders.length === 0 ||
              !signaturePin ||
              signed ||
              (hasContraindications && !overrideAcknowledged)
            }
            onClick={handleSignAndSubmit}
          >
            {signed ? "✓ Orders Signed & Transmitted" : "Electronically Sign & Transmit"}
          </button>
        </div>
      </footer>
    </section>
  );
};
