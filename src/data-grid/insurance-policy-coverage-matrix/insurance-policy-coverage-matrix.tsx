import React, { useId, useState, useMemo } from "react";
import styles from "./insurance-policy-coverage-matrix.module.css";

export type CoverageStatus = "bound" | "active" | "renewal_quoted" | "expired";

export interface PolicySublimit {
  perilName: string; // "Cyber Extortion & Ransomware"
  limitAmount: number; // $2,000,000
  deductible: number; // $50,000
}

export interface PolicyCoverageLine {
  id: string;
  lineOfBusiness: string; // "Commercial General Liability"
  carrierSyndicate: string; // "Chubb / Travelers Syndicate"
  perOccurrenceLimit: number; // $2,000,000
  aggregateLimit: number; // $4,000,000
  deductibleSir: number; // $25,000
  annualPremium: number; // $48,500
  status: CoverageStatus;
  endorsements: string[]; // ["Additional Insured", "Waiver of Subrogation"]
  sublimits?: PolicySublimit[];
}

export interface InsurancePolicyCoverageMatrixProps {
  policyholderName: string; // "Acme Global Enterprise Holdings Inc."
  masterPolicyNumber: string; // "POL-2026-US-8910"
  effectiveDates: string; // "Jan 01, 2026 – Dec 31, 2026"
  coverageLines: PolicyCoverageLine[];
  onSelectLine?: (line: PolicyCoverageLine) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const InsurancePolicyCoverageMatrix: React.FC<InsurancePolicyCoverageMatrixProps> = ({
  policyholderName,
  masterPolicyNumber,
  effectiveDates,
  coverageLines,
  onSelectLine,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const totalPremium = useMemo(() => {
    return coverageLines.reduce((sum, line) => sum + line.annualPremium, 0);
  }, [coverageLines]);

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: CoverageStatus) => {
    switch (status) {
      case "bound":
      case "active":
        return <span className={`${styles.statusBadge} ${styles.stActive}`}>Active / Bound</span>;
      case "renewal_quoted":
        return <span className={`${styles.statusBadge} ${styles.stQuoted}`}>Renewal Quoted</span>;
      case "expired":
        return <span className={`${styles.statusBadge} ${styles.stExpired}`}>Expired</span>;
    }
  };

  const formatCurrency = (val: number) => {
    return `$${val.toLocaleString()}`;
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.metaGroup}>
          <div className={styles.badgeRow}>
            <span className={styles.policyBadge}>COMMERCIAL RISK SCHEDULE</span>
            <span className={styles.policyNum}>{masterPolicyNumber}</span>
          </div>
          <h2 id={headingId} className={styles.policyholder}>
            {policyholderName}
          </h2>
          <p className={styles.effectiveDates}>Policy Period: {effectiveDates}</p>
        </div>

        <div className={styles.kpiContainer}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Bound Lines</span>
            <strong className={styles.kpiValue}>{coverageLines.length} Lines</strong>
          </div>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Annual Premium</span>
            <strong className={styles.kpiValueHighlight}>
              {formatCurrency(totalPremium)}
            </strong>
          </div>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Insurance Policy Coverage and Retention Matrix">
          <caption className={styles.srOnly}>
            Commercial insurance coverage schedule with policy limits, retention deductibles, and endorsements
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.thExpand}><span className={styles.srOnly}>Expand</span></th>
              <th scope="col" className={styles.thLeft}>Line of Business</th>
              <th scope="col" className={styles.thLeft}>Lead Underwriter</th>
              <th scope="col" className={styles.thRight}>Occurrence Limit</th>
              <th scope="col" className={styles.thRight}>Aggregate Limit</th>
              <th scope="col" className={styles.thRight}>Deductible / SIR</th>
              <th scope="col" className={styles.thRight}>Annual Premium</th>
              <th scope="col" className={styles.thCenter}>Status</th>
            </tr>
          </thead>
          <tbody>
            {coverageLines.map((line) => {
              const isExpanded = expandedRows[line.id] === true;
              const hasSublimits = Boolean(line.sublimits && line.sublimits.length > 0);

              return (
                <React.Fragment key={line.id}>
                  <tr
                    className={`${styles.row} ${isExpanded ? styles.rowExpanded : ""}`}
                    onClick={() => onSelectLine?.(line)}
                  >
                    <td className={styles.tdExpand}>
                      {hasSublimits ? (
                        <button
                          type="button"
                          className={styles.expandBtn}
                          onClick={(e) => toggleRow(line.id, e)}
                          aria-expanded={isExpanded}
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} sub-limits for ${line.lineOfBusiness}`}
                        >
                          {isExpanded ? "▼" : "▶"}
                        </button>
                      ) : (
                        <span className={styles.noExpandDash}>—</span>
                      )}
                    </td>
                    <td className={styles.tdLeft}>
                      <strong className={styles.lobTitle}>{line.lineOfBusiness}</strong>
                      <div className={styles.endorsementsList}>
                        {line.endorsements.map((end) => (
                          <span key={end} className={styles.endorsementBadge}>
                            {end}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={styles.tdLeft}>
                      <span className={styles.carrierName}>{line.carrierSyndicate}</span>
                    </td>
                    <td className={styles.tdRight}>{formatCurrency(line.perOccurrenceLimit)}</td>
                    <td className={styles.tdRight}>{formatCurrency(line.aggregateLimit)}</td>
                    <td className={styles.tdRight}>{formatCurrency(line.deductibleSir)}</td>
                    <td className={styles.tdRight}>
                      <strong>{formatCurrency(line.annualPremium)}</strong>
                    </td>
                    <td className={styles.tdCenter}>{getStatusBadge(line.status)}</td>
                  </tr>

                  {/* Sub-limits expansion row */}
                  {hasSublimits && isExpanded && (
                    <tr className={styles.sublimitRow}>
                      <td />
                      <td colSpan={7} className={styles.sublimitContent}>
                        <div className={styles.sublimitBox}>
                          <div className={styles.sublimitHeading}>
                            Scheduled Sub-Limits & Dedicated Retentions
                          </div>
                          <div className={styles.sublimitGrid}>
                            {line.sublimits!.map((sub) => (
                              <div key={sub.perilName} className={styles.sublimitCard}>
                                <strong className={styles.perilName}>{sub.perilName}</strong>
                                <div className={styles.perilValues}>
                                  <span>Sub-Limit: <strong>{formatCurrency(sub.limitAmount)}</strong></span>
                                  <span>Deductible: {formatCurrency(sub.deductible)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.footerRow}>
              <td colSpan={3} className={styles.footerLabel}>
                Program Total Premium Rollup ({coverageLines.length} lines):
              </td>
              <td colSpan={3} className={styles.footerNote}>
                Admitted & Non-Admitted Surplus Lines
              </td>
              <td className={styles.tdRight}>
                <strong>{formatCurrency(totalPremium)}</strong>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};
