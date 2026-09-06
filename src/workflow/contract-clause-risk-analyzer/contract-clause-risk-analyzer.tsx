import React, { useId, useState } from "react";
import styles from "./contract-clause-risk-analyzer.module.css";

export type ClauseRiskSeverity = "HIGH" | "MEDIUM" | "LOW";
export type ClauseResolutionStatus = "PROPOSED" | "ACCEPTED" | "REVERTED_TO_STANDARD";

export interface ContractClauseRiskItem {
  id: string;
  sectionNumber: string;
  clauseTitle: string;
  standardText: string;
  proposedText: string;
  riskSeverity: ClauseRiskSeverity;
  riskReason: string;
  status: ClauseResolutionStatus;
}

export const defaultContractClauses: ContractClauseRiskItem[] = [
  {
    id: "cls_lol_01",
    sectionNumber: "Sec 12.4",
    clauseTitle: "Limitation of Liability & Consequential Damages",
    standardText:
      "Except for breach of Section 8 (Confidentiality), each party's maximum aggregate liability arising out of or related to this Agreement shall be capped at the total fees paid in the preceding twelve (12) months.",
    proposedText:
      "Provider agrees to indemnify Customer for any and all claims without cap, including direct, indirect, lost profits, and consequential damages arising from service interruption.",
    riskSeverity: "HIGH",
    riskReason: "Uncapped liability violates corporate standard playbook LP-401 (Max cap 2x annual contract value).",
    status: "PROPOSED",
  },
  {
    id: "cls_indem_02",
    sectionNumber: "Sec 14.2",
    clauseTitle: "Intellectual Property Indemnification",
    standardText:
      "Provider shall defend Customer against any third-party claim alleging that the Software infringes any patent, copyright, or trademark registered in the United States.",
    proposedText:
      "Provider shall defend and hold harmless Customer worldwide against any allegation or investigation, irrespective of judicial finding of infringement.",
    riskSeverity: "HIGH",
    riskReason: "Worldwide pre-judgment defense expands exposure to jurisdictions outside authorized operating scope.",
    status: "PROPOSED",
  },
  {
    id: "cls_term_03",
    sectionNumber: "Sec 16.1",
    clauseTitle: "Termination for Convenience",
    standardText:
      "Either party may terminate this Agreement without cause upon ninety (90) days prior written notice.",
    proposedText:
      "Customer may terminate this Agreement without cause upon thirty (30) days prior written notice without early termination penalty.",
    riskSeverity: "MEDIUM",
    riskReason: "30-day termination window impacts multi-year revenue recognition and prepaid license amortization.",
    status: "PROPOSED",
  },
  {
    id: "cls_audit_04",
    sectionNumber: "Sec 18.5",
    clauseTitle: "Information Security Audit Rights",
    standardText:
      "Customer may review Provider's annual SOC 2 Type II audit report and ISO 27001 certifications upon request.",
    proposedText:
      "Customer reserves the right to conduct on-site penetration testing and physical inspections of Provider data centers once annually.",
    riskSeverity: "LOW",
    riskReason: "Physical inspection of multi-tenant cloud infrastructure is disallowable under AWS/GCP colocation rules.",
    status: "PROPOSED",
  },
];

export interface ContractClauseRiskAnalyzerProps {
  contractTitle?: string;
  counterparty?: string;
  clauses?: ContractClauseRiskItem[];
  onAcceptDeviation?: (clauseId: string) => void;
  onRevertToStandard?: (clauseId: string) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ContractClauseRiskAnalyzer: React.FC<ContractClauseRiskAnalyzerProps> = ({
  contractTitle = "Enterprise Master Subscription Agreement (MSA v4.2)",
  counterparty = "Vanguard Financial Services Inc.",
  clauses = defaultContractClauses,
  onAcceptDeviation,
  onRevertToStandard,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const filterId = useId();
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [clauseList, setClauseList] = useState<ContractClauseRiskItem[]>(clauses);

  const handleAccept = (clauseId: string) => {
    setClauseList((prev) =>
      prev.map((c) => (c.id === clauseId ? { ...c, status: "ACCEPTED" } : c))
    );
    onAcceptDeviation?.(clauseId);
  };

  const handleRevert = (clauseId: string) => {
    setClauseList((prev) =>
      prev.map((c) => (c.id === clauseId ? { ...c, status: "REVERTED_TO_STANDARD" } : c))
    );
    onRevertToStandard?.(clauseId);
  };

  const filteredClauses = clauseList.filter((c) => {
    if (filterSeverity === "ALL") return true;
    return c.riskSeverity === filterSeverity;
  });

  const highCount = clauseList.filter((c) => c.riskSeverity === "HIGH").length;
  const mediumCount = clauseList.filter((c) => c.riskSeverity === "MEDIUM").length;
  const lowCount = clauseList.filter((c) => c.riskSeverity === "LOW").length;

  const getSeverityPillClass = (sev: ClauseRiskSeverity) => {
    switch (sev) {
      case "HIGH":
        return styles.sevHigh;
      case "MEDIUM":
        return styles.sevMedium;
      case "LOW":
        return styles.sevLow;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.topRow}>
          <div className={styles.contractInfo}>
            <span className={styles.clmBadge}>Contract Intelligence &amp; Redline Engine</span>
            <span className={styles.contractTitle}>{contractTitle}</span>
            <span className={styles.counterpartyText}>Counterparty: {counterparty}</span>
          </div>

          <div className={styles.filterControls}>
            <label htmlFor={filterId} className={styles.selectLabel}>
              Filter Risk:
            </label>
            <select
              id={filterId}
              className={styles.selectInput}
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              aria-label="Filter contract deviations by risk level"
            >
              <option value="ALL">All Deviations ({clauseList.length})</option>
              <option value="HIGH">High Risk ({highCount})</option>
              <option value="MEDIUM">Medium Risk ({mediumCount})</option>
              <option value="LOW">Low Risk ({lowCount})</option>
            </select>
          </div>
        </div>

        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Clause Deviation Risk Analysis &amp; Playbook Alignment
          </h2>

          <div className={styles.riskSummary}>
            <span>
              High: <strong>{highCount}</strong>
            </span>
            <span>
              Medium: <strong>{mediumCount}</strong>
            </span>
            <span>
              Low: <strong>{lowCount}</strong>
            </span>
          </div>
        </div>
      </header>

      {/* Clause Deviations List */}
      <div className={styles.clauseList}>
        {filteredClauses.map((item) => (
          <article key={item.id} className={styles.clauseCard}>
            <div className={styles.clauseHeader}>
              <div className={styles.clauseTitleGroup}>
                <span className={styles.sectionNumber}>{item.sectionNumber}</span>
                <span className={styles.clauseName}>{item.clauseTitle}</span>
              </div>

              <div className={styles.badgeGroup}>
                <span className={`${styles.severityPill} ${getSeverityPillClass(item.riskSeverity)}`}>
                  {item.riskSeverity} RISK
                </span>
              </div>
            </div>

            <div className={styles.diffContainer}>
              <div className={styles.diffBox + " " + styles.standardBox}>
                <span className={styles.boxLabel}>Standard Approved Playbook Language</span>
                <p className={styles.clauseText}>{item.standardText}</p>
              </div>

              <div className={styles.diffBox + " " + styles.proposedBox}>
                <span className={styles.boxLabel}>Counterparty Proposed Redline</span>
                <p className={styles.clauseText}>{item.proposedText}</p>
              </div>
            </div>

            <div className={styles.rationaleAlert}>
              <strong>Legal Risk Exposure:</strong> {item.riskReason}
            </div>

            <div className={styles.cardActions}>
              {item.status === "PROPOSED" ? (
                <>
                  <button
                    type="button"
                    className={styles.acceptBtn}
                    onClick={() => handleAccept(item.id)}
                    aria-label={`Accept redline deviation for ${item.sectionNumber}`}
                  >
                    Accept Deviation
                  </button>
                  <button
                    type="button"
                    className={styles.revertBtn}
                    onClick={() => handleRevert(item.id)}
                    aria-label={`Revert to playbook standard for ${item.sectionNumber}`}
                  >
                    Revert to Standard
                  </button>
                </>
              ) : item.status === "ACCEPTED" ? (
                <span className={styles.statusLabel}>Deviation Accepted by Legal Counsel</span>
              ) : (
                <span className={styles.statusLabel}>Reverted to Approved Corporate Standard</span>
              )}
            </div>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        <span>Ironclad CLM / Legal Playbook NLP Semantic Risk Engine.</span>
        <span>Version: v4.2-APPROVED</span>
      </footer>
    </section>
  );
};
