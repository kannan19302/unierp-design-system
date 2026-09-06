import React, { useState, useId } from "react";
import styles from "./medication-administration-matrix.module.css";

export type DoseRoute = "oral" | "iv" | "subq" | "inhalation" | "topical";
export type DoseStatus = "due" | "given" | "overdue" | "held" | "refused";
export type ScanVerificationState = "pending" | "verified" | "mismatch_override";

export interface MedicationOrder {
  id: string;
  drugName: string;
  dosage: string;
  route: DoseRoute;
  frequency: string;
  scheduledTime: string;
  isHighAlert?: boolean; // requires dual nurse co-sign
  requiresCoSign?: boolean;
  allergyWarning?: string;
  status: DoseStatus;
  scanState: ScanVerificationState;
  administeredBy?: string;
  witnessedBy?: string;
}

export interface MedicationAdministrationMatrixProps {
  /** Patient full name */
  patientName?: string;
  /** Medical Record Number (MRN) */
  mrn?: string;
  /** Patient allergies list */
  allergies?: string[];
  /** Shift label */
  shiftLabel?: string;
  /** Active orders */
  orders: MedicationOrder[];
  /** Callback fired when a dose is administered */
  onAdministerDose?: (orderId: string, witnessNurse?: string) => void;
  /** Density setting */
  density?: "compact" | "comfortable";
  /** Custom class */
  className?: string;
}

export const MedicationAdministrationMatrix: React.FC<MedicationAdministrationMatrixProps> = ({
  patientName = "Eleanor Vance (Age 68)",
  mrn = "MRN-884109-A",
  allergies = ["Penicillin", "Sulfa Drugs"],
  shiftLabel = "Day Shift (07:00 – 19:00)",
  orders: initialOrders,
  onAdministerDose,
  density = "compact",
  className = "",
}) => {
  const [orders, setOrders] = useState<MedicationOrder[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [witnessName, setWitnessName] = useState<string>("");
  const headingId = useId();

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const getStatusBadge = (status: DoseStatus) => {
    switch (status) {
      case "due":
        return styles.statusDue;
      case "given":
        return styles.statusGiven;
      case "overdue":
        return styles.statusOverdue;
      case "held":
        return styles.statusHeld;
      case "refused":
        return styles.statusRefused;
    }
  };

  const handleAdminister = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: "given",
            scanState: "verified",
            administeredBy: "RN Sarah Jenkins (#4412)",
            witnessedBy: o.isHighAlert ? witnessName || "RN Marcus Aurel (#8901)" : undefined,
          };
        }
        return o;
      })
    );
    onAdministerDose?.(orderId, witnessName);
    setSelectedOrderId(null);
    setWitnessName("");
  };

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Patient eMAR Banner */}
      <header className={styles.header}>
        <div className={styles.patientInfo}>
          <div className={styles.avatarPill} aria-hidden="true">
            🏥
          </div>
          <div>
            <div className={styles.patientMeta}>
              <span className={styles.mrnTag}>{mrn}</span>
              <span className={styles.shiftTag}>{shiftLabel}</span>
            </div>
            <h2 id={headingId} className={styles.title}>{patientName}</h2>
          </div>
        </div>

        {/* Allergy Safety Corridor */}
        <div className={styles.allergyCorridor} aria-label="Known Patient Allergies">
          <span className={styles.allergyLabel}>⚠️ Contraindicated Allergies:</span>
          <div className={styles.allergyChips}>
            {allergies.map((allergy) => (
              <span key={allergy} className={styles.allergyChip}>
                {allergy}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Medication Orders Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.emarTable}>
          <thead>
            <tr>
              <th>Medication &amp; Order</th>
              <th>Route &amp; Frequency</th>
              <th>Scheduled Slot</th>
              <th>Safety Flags</th>
              <th>Barcode Scan</th>
              <th>Status</th>
              <th className={styles.actionCol}>Clinical Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={order.id === selectedOrderId ? styles.selectedRow : ""}>
                <td>
                  <div className={styles.drugCell}>
                    <span className={styles.drugName}>{order.drugName}</span>
                    <span className={styles.dosageText}>Dose: {order.dosage}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.routePill}>{order.route.toUpperCase()}</span>
                  <span className={styles.freqText}>{order.frequency}</span>
                </td>
                <td className={styles.timeCell}>{order.scheduledTime}</td>
                <td>
                  <div className={styles.flagsCol}>
                    {order.isHighAlert && (
                      <span className={styles.highAlertBadge}>
                        ⚡ HIGH ALERT (DUAL CO-SIGN)
                      </span>
                    )}
                    {order.allergyWarning && (
                      <span className={styles.allergyWarningBadge}>
                        ⛔ {order.allergyWarning}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.scanPill} ${
                      order.scanState === "verified"
                        ? styles.scanOk
                        : order.scanState === "mismatch_override"
                        ? styles.scanWarn
                        : styles.scanPending
                    }`}
                  >
                    {order.scanState === "verified"
                      ? "✓ Barcode Verified"
                      : order.scanState === "mismatch_override"
                      ? "⚠️ Override Verified"
                      : "Pending Patient/Drug Scan"}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadge(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  {order.administeredBy && (
                    <span className={styles.adminInfo}>By: {order.administeredBy}</span>
                  )}
                </td>
                <td className={styles.actionCol}>
                  {order.status === "due" || order.status === "overdue" ? (
                    <button
                      type="button"
                      className={styles.administerBtn}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      Administer Dose
                    </button>
                  ) : (
                    <span className={styles.completedText}>✓ Documented</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dual Nurse Verification Modal */}
      {selectedOrder && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="emar-dialog-title"
        >
          <div className={styles.modalCard}>
            <h3 id="emar-dialog-title" className={styles.modalTitle}>
              Verify &amp; Administer: {selectedOrder.drugName} ({selectedOrder.dosage})
            </h3>
            <p className={styles.modalDesc}>
              Enforce the 5 Rights of Medication Administration: Right Patient, Right Drug, Right Dose, Right Route, Right Time.
            </p>

            {selectedOrder.isHighAlert && (
              <div className={styles.highAlertWarningBox}>
                <strong>⚡ High-Alert Medication Protocol:</strong> This medication requires an independent secondary verification by a licensed registered nurse witness.
                <div className={styles.witnessInputGroup}>
                  <label htmlFor="witness-nurse-id" className={styles.witnessLabel}>
                    Witness RN Name &amp; License #:
                  </label>
                  <input
                    id="witness-nurse-id"
                    type="text"
                    required
                    placeholder="e.g. RN Marcus Aurel (#8901)"
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    className={styles.witnessInput}
                  />
                </div>
              </div>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setSelectedOrderId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmBtn}
                disabled={selectedOrder.isHighAlert && !witnessName.trim()}
                onClick={() => handleAdminister(selectedOrder.id)}
              >
                Confirm Administration
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
