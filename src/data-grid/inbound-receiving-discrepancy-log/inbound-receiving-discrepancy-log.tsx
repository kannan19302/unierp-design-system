import React, { useId, useState } from "react";
import styles from "./inbound-receiving-discrepancy-log.module.css";

export type ReceivingDisposition =
  | "ACCEPTED"
  | "QUARANTINED"
  | "RETURNED_TO_VENDOR"
  | "PENDING_INSPECTION";

export interface InboundReceivingLine {
  id: string; // "rcv_line_01"
  sku: string; // "AV-TURB-772"
  description: string; // "Titanium Compressor Rotor Blade 70mm"
  expectedUnits: number; // 500
  receivedUnits: number; // 480
  damagedUnits: number; // 5
  discrepancyUnits: number; // -20 (shortage)
  lotNumber: string; // "LOT-2026-B81"
  coldChainCelsius?: number; // e.g. 4.2
  disposition: ReceivingDisposition;
}

export interface InboundReceivingDiscrepancyLogProps {
  poNumber?: string;
  supplierName?: string;
  dockDoor?: string;
  lines: InboundReceivingLine[];
  onUpdateDisposition?: (lineId: string, disposition: ReceivingDisposition) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const InboundReceivingDiscrepancyLog: React.FC<InboundReceivingDiscrepancyLogProps> = ({
  poNumber = "PO-2026-9914",
  supplierName = "Honeywell Aerospace Avionics",
  dockDoor = "Dock 04B",
  lines: initialLines,
  onUpdateDisposition,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [lines, setLines] = useState<InboundReceivingLine[]>(initialLines);

  const totalExpected = lines.reduce((acc, l) => acc + l.expectedUnits, 0);
  const totalReceived = lines.reduce((acc, l) => acc + l.receivedUnits, 0);
  const totalDamaged = lines.reduce((acc, l) => acc + l.damagedUnits, 0);
  const totalDiscrepancy = lines.reduce((acc, l) => acc + l.discrepancyUnits, 0);

  const handleDispositionChange = (lineId: string, newDisposition: ReceivingDisposition) => {
    setLines((prev) =>
      prev.map((l) => (l.id === lineId ? { ...l, disposition: newDisposition } : l))
    );
    onUpdateDisposition?.(lineId, newDisposition);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.badgeGroup}>
            <span className={styles.wmsBadge}>INBOUND WMS RECEIVING DISCREPANCY LOG</span>
            <span className={styles.poBadge}>{poNumber}</span>
          </div>

          <div className={styles.kpiPills}>
            <span className={styles.kpiTotal}>{totalReceived} / {totalExpected} Received</span>
            {totalDamaged > 0 && (
              <span className={styles.kpiDamaged}>{totalDamaged} Damaged Units</span>
            )}
            {totalDiscrepancy !== 0 && (
              <span className={styles.kpiDiscrepancy}>
                {totalDiscrepancy > 0 ? `+${totalDiscrepancy}` : totalDiscrepancy} Variance
              </span>
            )}
          </div>
        </div>

        <div className={styles.titleRow}>
          <div>
            <h2 id={headingId} className={styles.title}>
              Dock Inbound Shipment Receiving &amp; Quality Inspection
            </h2>
            <div className={styles.supplierText}>
              Supplier: {supplierName} • Assigned: {dockDoor}
            </div>
          </div>
        </div>
      </header>

      {/* Discrepancy Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Inbound receiving line discrepancy ledger">
          <thead>
            <tr>
              <th scope="col">SKU &amp; Description</th>
              <th scope="col">Lot #</th>
              <th scope="col">Expected</th>
              <th scope="col">Received</th>
              <th scope="col">Damaged</th>
              <th scope="col">Variance</th>
              <th scope="col">Disposition</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((item) => {
              const hasVariance = item.discrepancyUnits !== 0;
              const hasDamage = item.damagedUnits > 0;
              const isQuarantined = item.disposition === "QUARANTINED";

              return (
                <tr
                  key={item.id}
                  className={`${
                    isQuarantined
                      ? styles.quarantineRow
                      : hasDamage || hasVariance
                      ? styles.varianceRow
                      : ""
                  }`}
                >
                  <td>
                    <div className={styles.skuCell}>
                      <span className={styles.skuText}>{item.sku}</span>
                      <span className={styles.descText}>{item.description}</span>
                    </div>
                  </td>
                  <td className={styles.monoCell}>{item.lotNumber}</td>
                  <td className={styles.monoCell}>{item.expectedUnits.toLocaleString()}</td>
                  <td className={styles.monoCell}>{item.receivedUnits.toLocaleString()}</td>
                  <td
                    className={`${styles.monoCell} ${hasDamage ? styles.damagedText : ""}`}
                  >
                    {item.damagedUnits.toLocaleString()}
                  </td>
                  <td
                    className={`${styles.monoCell} ${
                      item.discrepancyUnits < 0
                        ? styles.shortageText
                        : item.discrepancyUnits > 0
                        ? styles.overageText
                        : ""
                    }`}
                  >
                    {item.discrepancyUnits > 0 ? `+${item.discrepancyUnits}` : item.discrepancyUnits}
                  </td>
                  <td>
                    <span
                      className={`${styles.dispositionBadge} ${
                        item.disposition === "ACCEPTED"
                          ? styles.dispAccepted
                          : item.disposition === "QUARANTINED"
                          ? styles.dispQuarantined
                          : item.disposition === "RETURNED_TO_VENDOR"
                          ? styles.dispRtv
                          : styles.dispPending
                      }`}
                    >
                      {item.disposition.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td>
                    <select
                      className={styles.actionSelect}
                      value={item.disposition}
                      onChange={(e) =>
                        handleDispositionChange(item.id, e.target.value as ReceivingDisposition)
                      }
                      aria-label={`Update disposition for SKU ${item.sku}`}
                    >
                      <option value="ACCEPTED">Accept</option>
                      <option value="QUARANTINED">Quarantine</option>
                      <option value="RETURNED_TO_VENDOR">Return to Vendor</option>
                      <option value="PENDING_INSPECTION">Hold Inspection</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          Enforces ISO 9001:2015 &amp; AS9100D receiving inspection standards. Quarantined stock immediately segregated from pick inventory.
        </span>
      </footer>
    </section>
  );
};
