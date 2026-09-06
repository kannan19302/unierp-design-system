import React, { useId, useState } from "react";
import styles from "./freight-carrier-rate-comparator.module.css";

export type FreightTransportMode = "LTL" | "FTL" | "AIR_EXPEDITE" | "INTERMODAL";
export type TenderAwardStatus = "AWARDED" | "QUOTED" | "DECLINED" | "EXPIRED";

export interface FreightCarrierQuote {
  id: string; // "quote_fxfe_01"
  carrierName: string; // "FedEx Freight Priority"
  scacCode: string; // "FXFE"
  mode: FreightTransportMode;
  transitDays: number; // 2
  baseRateUsd: number; // 1250.00
  fuelSurchargeUsd: number; // 180.50
  accessorialsUsd: number; // 75.00
  totalLandedCostUsd: number; // 1505.50
  tenderStatus: TenderAwardStatus;
  guaranteedDelivery: boolean;
}

export interface FreightLaneSpecification {
  originPostal: string; // "60666 (Chicago, IL)"
  destinationPostal: string; // "75261 (Dallas, TX)"
  palletCount: number; // 4
  totalWeightLbs: number; // 3400
  freightClass: string; // "Class 70"
}

export interface FreightCarrierRateComparatorProps {
  lane: FreightLaneSpecification;
  quotes: FreightCarrierQuote[];
  onAwardTender?: (quoteId: string, carrierName: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const FreightCarrierRateComparator: React.FC<FreightCarrierRateComparatorProps> = ({
  lane,
  quotes: initialQuotes,
  onAwardTender,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [quotes, setQuotes] = useState<FreightCarrierQuote[]>(initialQuotes);

  const handleAward = (quoteId: string, carrierName: string) => {
    setQuotes((prev) =>
      prev.map((q) => ({
        ...q,
        tenderStatus: q.id === quoteId ? "AWARDED" : q.tenderStatus === "AWARDED" ? "QUOTED" : q.tenderStatus,
      }))
    );
    onAwardTender?.(quoteId, carrierName);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  const lowestRate = Math.min(...quotes.map((q) => q.totalLandedCostUsd));
  const fastestDays = Math.min(...quotes.map((q) => q.transitDays));

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.logisticsBadge}>LOGISTICS &amp; TMS RATE PROCUREMENT</span>
          <span className={styles.carrierCountBadge}>{quotes.length} CARRIER RATES QUOTED</span>
        </div>
        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Freight Lane Quote Comparator &amp; Carrier Tender Engine
          </h2>
          <div className={styles.laneRoute}>
            <span className={styles.lanePoint}>{lane.originPostal}</span>
            <span className={styles.laneArrow}>➔</span>
            <span className={styles.lanePoint}>{lane.destinationPostal}</span>
          </div>
        </div>
      </header>

      {/* Cargo Specifications Strip */}
      <div className={styles.specStrip}>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Pallet Count:</span>
          <span className={styles.specValue}>{lane.palletCount} Skids</span>
        </div>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Total Gross Weight:</span>
          <span className={styles.specValue}>{lane.totalWeightLbs.toLocaleString()} lbs</span>
        </div>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>NMFC Freight Class:</span>
          <span className={styles.specValue}>{lane.freightClass}</span>
        </div>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Best Landed Rate:</span>
          <span className={`${styles.specValue} ${styles.valBest}`}>
            {formatCurrency(lowestRate)}
          </span>
        </div>
      </div>

      {/* Rate Matrix Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Carrier freight rate quote comparisons">
          <thead>
            <tr>
              <th scope="col">Carrier &amp; SCAC</th>
              <th scope="col">Mode</th>
              <th scope="col">Transit Days</th>
              <th scope="col">Base Rate</th>
              <th scope="col">Fuel Surcharge</th>
              <th scope="col">Accessorials</th>
              <th scope="col">Total Landed Cost</th>
              <th scope="col">Tender Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => {
              const isBestRate = q.totalLandedCostUsd === lowestRate;
              const isFastest = q.transitDays === fastestDays;
              const isAwarded = q.tenderStatus === "AWARDED";

              return (
                <tr key={q.id} className={isAwarded ? styles.awardedRow : ""}>
                  <td>
                    <div className={styles.carrierCell}>
                      <span className={styles.carrierName}>{q.carrierName}</span>
                      <span className={styles.scacCode}>SCAC: {q.scacCode}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.modeBadge}>{q.mode.replace(/_/g, " ")}</span>
                  </td>
                  <td>
                    <div className={styles.transitCell}>
                      <span className={styles.daysText}>{q.transitDays} Business Days</span>
                      {isFastest && <span className={styles.fastestPill}>Fastest</span>}
                    </div>
                  </td>
                  <td className={styles.monoCell}>{formatCurrency(q.baseRateUsd)}</td>
                  <td className={styles.monoCell}>{formatCurrency(q.fuelSurchargeUsd)}</td>
                  <td className={styles.monoCell}>{formatCurrency(q.accessorialsUsd)}</td>
                  <td>
                    <div className={styles.costCell}>
                      <span className={`${styles.costValue} ${isBestRate ? styles.costBest : ""}`}>
                        {formatCurrency(q.totalLandedCostUsd)}
                      </span>
                      {isBestRate && <span className={styles.bestRatePill}>Lowest Cost</span>}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.statusPill} ${
                        isAwarded
                          ? styles.statusAwarded
                          : q.tenderStatus === "QUOTED"
                          ? styles.statusQuoted
                          : styles.statusDeclined
                      }`}
                    >
                      {q.tenderStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.awardBtn}
                      onClick={() => handleAward(q.id, q.carrierName)}
                      disabled={isAwarded || q.tenderStatus === "EXPIRED" || q.tenderStatus === "DECLINED"}
                      aria-label={`Award shipment tender to ${q.carrierName}`}
                    >
                      {isAwarded ? "Tender Awarded" : "Award Tender"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerNote}>
          Rates include statutory fuel surcharges (DOE index). Awarding triggers electronic EDI 204 shipment tender dispatch.
        </span>
      </footer>
    </section>
  );
};
