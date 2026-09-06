import React, { useId, useState } from "react";
import styles from "./tenant-screening-scorecard.module.css";

export type ScreeningDecision = "approve" | "conditional_deposit" | "decline";

export interface ScreeningCriteriaItem {
  id: string;
  category: "credit" | "income" | "eviction" | "criminal" | "rental_history";
  name: string; // e.g. "FICO Credit Score (Experian)"
  observedValue: string; // "745"
  thresholdRequired: string; // ">= 650"
  status: "pass" | "conditional" | "fail";
  details: string; // "No late payments reported in last 24 months"
}

export interface TenantApplicantProfile {
  applicantId: string; // "APP-2026-904"
  fullName: string; // "Marcus Vance"
  targetUnit: string; // "Unit 402 - 2BR / 2BA ($2,850/mo)"
  propertyAddress: string; // "1040 Meridian Way, Seattle, WA"
  monthlyIncome: number; // e.g. $9,500
  monthlyRent: number; // $2,850
  rentToIncomePct: number; // 30.0%
  overallScore: number; // 88 / 100
  automatedRecommendation: ScreeningDecision;
  criteria: ScreeningCriteriaItem[];
}

export interface TenantScreeningScorecardProps {
  applicant: TenantApplicantProfile;
  onApproveApplication?: (applicantId: string) => void;
  onDeclineApplication?: (applicantId: string, reason: string) => void;
  onOverrideDecision?: (applicantId: string, decision: ScreeningDecision) => void;
  density?: "ultra-compact" | "compact" | "standard" | "comfortable";
  className?: string;
}

export const TenantScreeningScorecard: React.FC<TenantScreeningScorecardProps> = ({
  applicant,
  onApproveApplication,
  onDeclineApplication,
  onOverrideDecision,
  density = "compact",
  className = "",
}) => {
  const headingId = useId();
  const [activeDecision, setActiveDecision] = useState<ScreeningDecision>(
    applicant.automatedRecommendation
  );

  const handleDecisionClick = (dec: ScreeningDecision) => {
    setActiveDecision(dec);
    if (dec === "approve") {
      onApproveApplication?.(applicant.applicantId);
    } else if (dec === "decline") {
      onDeclineApplication?.(applicant.applicantId, "Criteria threshold not met");
    } else {
      onOverrideDecision?.(applicant.applicantId, dec);
    }
  };


  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <section
      className={`${styles.container} ${styles[density]} ${className}`}
      aria-labelledby={headingId}
      data-density={density}
    >
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.iconTag} aria-hidden="true">
            📋
          </div>
          <div>
            <div className={styles.metaRow}>
              <span className={styles.appBadge}>{applicant.applicantId}</span>
              <span className={styles.unitTag}>{applicant.targetUnit}</span>
              <span className={styles.propTag}>{applicant.propertyAddress}</span>
            </div>
            <h2 id={headingId} className={styles.title}>
              Tenant Underwriting &amp; Background Screening Scorecard
            </h2>
            <div className={styles.nameRow}>
              <span>Applicant: <strong>{applicant.fullName}</strong></span>
            </div>
          </div>
        </div>

        {/* Overall Score Dial */}
        <div className={styles.scoreDialBox}>
          <span className={styles.scoreDialLabel}>Underwriting Score</span>
          <div className={styles.scoreDialNumber}>
            <span>{applicant.overallScore}</span>
            <span className={styles.scoreDialMax}>/100</span>
          </div>
        </div>
      </header>

      {/* Financial Capacity Ribbon */}
      <div className={styles.financialRibbon}>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Monthly Gross Income</span>
          <span className={styles.ribbonVal}>{formatCurrency(applicant.monthlyIncome)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Proposed Monthly Rent</span>
          <span className={styles.ribbonVal}>{formatCurrency(applicant.monthlyRent)}</span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Rent-to-Income Ratio</span>
          <span
            className={`${styles.ribbonVal} ${
              applicant.rentToIncomePct > 33 ? styles.ratioWarning : styles.ratioGood
            }`}
          >
            {applicant.rentToIncomePct.toFixed(1)}% (Max 33%)
          </span>
        </div>
        <div className={styles.ribbonItem}>
          <span className={styles.ribbonLabel}>Automated Engine Verdict</span>
          <span
            className={`${styles.verdictBadge} ${
              applicant.automatedRecommendation === "approve"
                ? styles.verdictApprove
                : applicant.automatedRecommendation === "conditional_deposit"
                ? styles.verdictConditional
                : styles.verdictDecline
            }`}
          >
            {applicant.automatedRecommendation.replace(/_/g, " ").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Evaluation Rubric Grid */}
      <div className={styles.rubricPane}>
        <h3 className={styles.paneTitle}>Screening Criteria Breakdown</h3>
        <div className={styles.criteriaGrid}>
          {applicant.criteria.map((item) => (
            <div
              key={item.id}
              className={`${styles.criteriaCard} ${
                item.status === "pass"
                  ? styles.cardPass
                  : item.status === "conditional"
                  ? styles.cardConditional
                  : styles.cardFail
              }`}
            >
              <div className={styles.criteriaHeader}>
                <span className={styles.statusIcon} aria-hidden="true">
                  {item.status === "pass" ? "✓" : item.status === "conditional" ? "⚠️" : "⛔"}
                </span>
                <h4 className={styles.criteriaName}>{item.name}</h4>
                <span className={styles.statusBadge}>
                  {item.status.toUpperCase()}
                </span>
              </div>
              <div className={styles.metricRow}>
                <span>Observed: <strong>{item.observedValue}</strong></span>
                <span>Requirement: <strong>{item.thresholdRequired}</strong></span>
              </div>
              <p className={styles.criteriaDetails}>{item.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Sign-off Footer */}
      <footer className={styles.decisionFooter}>
        <div className={styles.decisionPrompt}>
          <span className={styles.promptTitle}>Property Manager Adjudication:</span>
          <span className={styles.promptSub}>
            Adjudicate applicant status and release lease agreement contract.
          </span>
        </div>

        <div className={styles.decisionButtons}>
          <button
            type="button"
            className={`${styles.decisionBtn} ${styles.approveBtn} ${
              activeDecision === "approve" ? styles.activeChoice : ""
            }`}
            onClick={() => handleDecisionClick("approve")}
          >
            ✓ Approve Application
          </button>
          <button
            type="button"
            className={`${styles.decisionBtn} ${styles.conditionalBtn} ${
              activeDecision === "conditional_deposit" ? styles.activeChoice : ""
            }`}
            onClick={() => handleDecisionClick("conditional_deposit")}
          >
            ⚠️ Require 2x Security Deposit
          </button>
          <button
            type="button"
            className={`${styles.decisionBtn} ${styles.declineBtn} ${
              activeDecision === "decline" ? styles.activeChoice : ""
            }`}
            onClick={() => handleDecisionClick("decline")}
          >
            ⛔ Decline Applicant
          </button>
        </div>
      </footer>
    </section>
  );
};
