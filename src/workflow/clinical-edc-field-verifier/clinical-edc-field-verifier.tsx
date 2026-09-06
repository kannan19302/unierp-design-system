import React, { useId, useState } from "react";
import styles from "./clinical-edc-field-verifier.module.css";

export type EdcSdvStatus = "VERIFIED" | "PENDING_SDV" | "QUERY_OPEN" | "DISCREPANT";

export interface EdcFieldRecord {
  id: string;
  formName: string;
  fieldLabel: string;
  currentValue: string;
  expectedType: string;
  sdvStatus: EdcSdvStatus;
  queryCount: number;
  lastModifiedBy: string;
  lastModifiedAt: string;
  isLocked: boolean;
}

export const defaultEdcFieldRecords: EdcFieldRecord[] = [
  {
    id: "edc_vs_01",
    formName: "Vital Signs (VS01)",
    fieldLabel: "Systolic Blood Pressure",
    currentValue: "128 mmHg",
    expectedType: "Numeric [80-200]",
    sdvStatus: "VERIFIED",
    queryCount: 0,
    lastModifiedBy: "crc_martinez@mayo.org",
    lastModifiedAt: "2026-09-06 08:30 UTC",
    isLocked: false,
  },
  {
    id: "edc_vs_02",
    formName: "Vital Signs (VS01)",
    fieldLabel: "Heart Rate",
    currentValue: "114 bpm",
    expectedType: "Numeric [40-160]",
    sdvStatus: "PENDING_SDV",
    queryCount: 0,
    lastModifiedBy: "crc_martinez@mayo.org",
    lastModifiedAt: "2026-09-06 08:31 UTC",
    isLocked: false,
  },
  {
    id: "edc_ae_01",
    formName: "Adverse Events (AE01)",
    fieldLabel: "AE Onset Date",
    currentValue: "2026-08-30",
    expectedType: "ISO-8601 Date",
    sdvStatus: "QUERY_OPEN",
    queryCount: 2,
    lastModifiedBy: "pi_dr_henderson@mayo.org",
    lastModifiedAt: "2026-09-05 16:45 UTC",
    isLocked: false,
  },
  {
    id: "edc_lb_01",
    formName: "Lab Chemistry (LB01)",
    fieldLabel: "Serum Creatinine",
    currentValue: "2.4 mg/dL",
    expectedType: "Numeric [0.5-1.3]",
    sdvStatus: "DISCREPANT",
    queryCount: 1,
    lastModifiedBy: "lab_tech_chen@central-lab.com",
    lastModifiedAt: "2026-09-06 06:15 UTC",
    isLocked: false,
  },
];

export interface ClinicalEdcFieldVerifierProps {
  studyProtocolNumber?: string;
  subjectId?: string;
  siteNumber?: string;
  records?: EdcFieldRecord[];
  onVerifyField?: (fieldId: string) => void;
  onRaiseQuery?: (fieldId: string, reason: string) => void;
  onLockForm?: () => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const ClinicalEdcFieldVerifier: React.FC<ClinicalEdcFieldVerifierProps> = ({
  studyProtocolNumber = "PROTO-ONC-2026-IMMUNO-X",
  subjectId = "SUBJ-1049-C2",
  siteNumber = "SITE-014 (Mayo Rochester)",
  records = defaultEdcFieldRecords,
  onVerifyField,
  onRaiseQuery,
  onLockForm,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const filterSelectId = useId();
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [fieldRecords, setFieldRecords] = useState<EdcFieldRecord[]>(records);
  const [isFormLocked, setIsFormLocked] = useState<boolean>(false);

  const handleVerify = (fieldId: string) => {
    setFieldRecords((prev) =>
      prev.map((r) => (r.id === fieldId ? { ...r, sdvStatus: "VERIFIED" } : r))
    );
    onVerifyField?.(fieldId);
  };

  const handleQuery = (fieldId: string) => {
    setFieldRecords((prev) =>
      prev.map((r) =>
        r.id === fieldId
          ? { ...r, sdvStatus: "QUERY_OPEN", queryCount: r.queryCount + 1 }
          : r
      )
    );
    onRaiseQuery?.(fieldId, "Source documentation requested for discrepancy verification");
  };

  const handleLock = () => {
    setIsFormLocked(true);
    setFieldRecords((prev) => prev.map((r) => ({ ...r, isLocked: true })));
    onLockForm?.();
  };

  const filteredRecords = fieldRecords.filter((r) => {
    if (selectedFilter === "ALL") return true;
    return r.sdvStatus === selectedFilter;
  });

  const verifiedCount = fieldRecords.filter((r) => r.sdvStatus === "VERIFIED").length;
  const queryCount = fieldRecords.filter((r) => r.sdvStatus === "QUERY_OPEN").length;
  const pendingCount = fieldRecords.filter((r) => r.sdvStatus === "PENDING_SDV").length;

  const getStatusClass = (status: EdcSdvStatus) => {
    switch (status) {
      case "VERIFIED":
        return styles.statusVerified;
      case "PENDING_SDV":
        return styles.statusPending;
      case "QUERY_OPEN":
        return styles.statusQuery;
      case "DISCREPANT":
        return styles.statusDiscrepant;
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.container} ${className}`}
      data-density={density}
    >
      <header className={styles.header}>
        <div className={styles.bannerRow}>
          <div className={styles.studyInfo}>
            <span className={styles.cfrBadge}>FDA 21 CFR Part 11 Validated</span>
            <span className={styles.protocolText}>{studyProtocolNumber}</span>
            <span className={styles.subjectBadge}>Subject: {subjectId}</span>
            <span className={styles.subjectBadge}>{siteNumber}</span>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.lockBtn}
              onClick={handleLock}
              disabled={isFormLocked}
              aria-label="Lock eCRF form records"
            >
              {isFormLocked ? "eCRF Locked" : "Lock Subject eCRF"}
            </button>
          </div>
        </div>

        <div className={styles.titleRow}>
          <h2 id={headingId} className={styles.title}>
            Clinical Source Data Verification (SDV) &amp; Query Workbench
          </h2>

          <div className={styles.statsBar}>
            <span className={styles.statItem}>
              Verified: <strong className={styles.statValue}>{verifiedCount}</strong>
            </span>
            <span className={styles.statItem}>
              Pending SDV: <strong className={styles.statValue}>{pendingCount}</strong>
            </span>
            <span className={styles.statItem}>
              Open Queries: <strong className={styles.statValue}>{queryCount}</strong>
            </span>
          </div>
        </div>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.filterControls}>
          <label htmlFor={filterSelectId} className={styles.selectInput}>
            Filter Status:
          </label>
          <select
            id={filterSelectId}
            className={styles.selectInput}
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            aria-label="Filter records by SDV status"
          >
            <option value="ALL">All Statuses ({fieldRecords.length})</option>
            <option value="VERIFIED">Verified ({verifiedCount})</option>
            <option value="PENDING_SDV">Pending SDV ({pendingCount})</option>
            <option value="QUERY_OPEN">Query Open ({queryCount})</option>
            <option value="DISCREPANT">Discrepant</option>
          </select>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Clinical EDC Fields and SDV Audits">
          <thead>
            <tr>
              <th scope="col">CRF Form</th>
              <th scope="col">Data Element</th>
              <th scope="col">Recorded Value</th>
              <th scope="col">Expected Type</th>
              <th scope="col">SDV Status</th>
              <th scope="col">Audit Trail &amp; Timestamp</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((item) => (
              <tr key={item.id}>
                <td className={styles.formCell}>{item.formName}</td>
                <td className={styles.fieldLabel}>{item.fieldLabel}</td>
                <td>
                  <span className={styles.valCell}>{item.currentValue}</span>
                </td>
                <td>{item.expectedType}</td>
                <td>
                  <span className={`${styles.statusPill} ${getStatusClass(item.sdvStatus)}`}>
                    {item.sdvStatus.replace("_", " ")}
                  </span>
                </td>
                <td className={styles.auditCell}>
                  <span className={styles.auditUser}>{item.lastModifiedBy}</span>
                  <span>{item.lastModifiedAt}</span>
                </td>
                <td className={styles.actionCell}>
                  {item.isLocked || isFormLocked ? (
                    <span className={styles.lockedNotice}>Field Locked</span>
                  ) : (
                    <>
                      {item.sdvStatus !== "VERIFIED" && (
                        <button
                          type="button"
                          className={styles.verifyBtn}
                          onClick={() => handleVerify(item.id)}
                          aria-label={`Verify source data for ${item.fieldLabel}`}
                        >
                          Verify SDV
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.queryBtn}
                        onClick={() => handleQuery(item.id)}
                        aria-label={`Raise clinical query for ${item.fieldLabel}`}
                      >
                        Raise Query
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className={styles.footer}>
        <span>CDISC ODM / HL7 FHIR Clinical Research Data Standard Compliant.</span>
        <span>Audit Trail Hash: SHA256:b8f9e1...</span>
      </footer>
    </section>
  );
};
