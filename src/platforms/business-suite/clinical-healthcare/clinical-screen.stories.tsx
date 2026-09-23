import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StrataBar } from "../../../core/shell/strata-bar";
import { PageHeader } from "../../../core/layout/page-header";
import { DetailPageTemplate } from "../../../core/layout/detail-page-template";
import { ClinicalDecisionSupportAlert } from "./clinical-decision-support-alert";
import { FactBox, FactBoxTile, FactBoxField, FactBoxMetric } from "../../../core/layout/fact-box";
import { OmnichannelContactBar } from "../../../core/layout/omnichannel-contact-bar";
import { Badge } from "../../../core/primitives/badge";
import { Button } from "../../../core/primitives/button";
import { UserCheck, Stethoscope, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

const meta: Meta = {
  title: "Platforms/BusinessSuite/Clinical/ClinicalScreen",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const HospitalEmergencyCdsWorkbench: StoryObj = {
  render: () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* 1. Strata Breadcrumb Bar */}
        <StrataBar
          segments={["clinical-ehr", "icu-ward-b", "patients", "MRN-90281-PATEL"]}
          scope="site"
          state={{
            kind: "danger",
            label: "Critical Medication Contraindication (Level 1A)",
          }}
          action={
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button size="sm" variant="ghost">Pharmacy Consult</Button>
              <Button size="sm" variant="danger">Cancel Medication Order</Button>
            </div>
          }
        />

        {/* 2. Detail Page Template with Embedded CDS Guardrail */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <DetailPageTemplate
            title="EHR Clinical Order Entry & Patient Safety Guardrail"
            subtitle="Patient: Eleanor Patel • 68 yo Female • MRN: 90281-PATEL • Room: ICU-04"
            backLabel="Back to Ward Census"
            meta={
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Badge variant="danger">High Risk Alert</Badge>
                <Badge variant="secondary">Inpatient ICU</Badge>
              </div>
            }
            actions={
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="secondary" size="sm">Review Vitals History</Button>
                <Button variant="primary" size="sm">Authorize Override</Button>
              </div>
            }
            tabs={[
              {
                key: "cds-guardrail",
                label: "Clinical Safety Alerts",
                count: 1,
                content: (
                  <div style={{ padding: "var(--space-2) 0" }}>
                    <ClinicalDecisionSupportAlert
                      alertId="CDS-DRUG-RENAL-889"
                      severity="critical"
                      title="Severe Nephrotoxicity Risk: Vancomycin + Gentamicin Concurrent Therapy"
                      patient={{
                        name: "Eleanor Patel",
                        mrn: "90281-PATEL",
                        age: 68,
                        gender: "Female",
                        egfr: 28,
                        allergies: ["Penicillin", "Sulfa Antibiotics"],
                      }}
                      triggeringOrder="Rx: Gentamicin IV 5mg/kg Q24H (Ordered by Dr. R. Chen, MD)"
                      clinicalExplanation="Patient's acute renal function has deteriorated (eGFR 28 mL/min/1.73m² down from 54). Co-administration of IV Gentamicin with ongoing Vancomycin therapy creates a 6.4x amplified risk of irreversible acute tubular necrosis (ATN)."
                      evidenceGrade="Grade 1A (Strong Evidence; UpToDate 2026.3)"
                      recommendations={[
                        {
                          id: "rec-1",
                          title: "Substitute with Ceftobiprole or Daptomycin",
                          description: "Preserves gram-positive coverage without aminoglycoside synergy nephrotoxicity.",
                          suggestedDose: "Daptomycin 6mg/kg IV Q48H (Adjusted for CrCl < 30)",
                        },
                        {
                          id: "rec-2",
                          title: "Execute Immediate Therapeutic Drug Monitoring (TDM) Peak & Trough",
                          description: "Order STAT serum creatinine and vancomycin trough prior to next administration.",
                        },
                      ]}
                      density="compact"
                    />
                  </div>
                ),
              },
              {
                key: "active-meds",
                label: "Active Medication Orders",
                count: 6,
                content: (
                  <div
                    style={{
                      padding: "var(--space-4)",
                      backgroundColor: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Current Inpatient Medication Regimen</h4>
                    <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                      Vancomycin IV (Active) • Norepinephrine infusion (Active) • Heparin subcutaneous (Active).
                    </p>
                  </div>
                ),
              },
              {
                key: "labs",
                label: "Laboratory & Renal Function Trends",
                content: (
                  <div
                    style={{
                      padding: "var(--space-4)",
                      backgroundColor: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <h4 style={{ margin: "0 0 var(--space-2) 0" }}>Renal Biomarkers (Past 48h)</h4>
                    <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                      Serum Creatinine: 2.4 mg/dL (Elevated) • BUN: 44 mg/dL • Potassium: 4.8 mEq/L (Normal).
                    </p>
                  </div>
                ),
              },
            ]}
            contextRail={
              <FactBox title="Patient Safety Intelligence" density="compact">
                <FactBoxTile title="Renal Health Status">
                  <FactBoxMetric
                    label="Estimated GFR"
                    value="28 mL/min"
                    trend="down"
                    trendValue="-26 mL/min (48h)"
                    subtext="Stage 4 Severe Kidney Impairment"
                  />
                  <div style={{ marginTop: "var(--space-3)" }}>
                    <FactBoxField label="Creatinine Clearance" value="26.4 mL/min" mono />
                    <FactBoxField label="Weight / Height" value="64 kg / 162 cm" />
                    <FactBoxField label="Code Status" value="Full Code" highlight />
                  </div>
                </FactBoxTile>

                <FactBoxTile title="Attending Care Team">
                  <FactBoxField label="Attending Physician" value="Dr. Robert Chen, MD" />
                  <FactBoxField label="Clinical Pharmacist" value="Jennifer Walsh, PharmD" />
                  <FactBoxField label="ICU Charge Nurse" value="Marcus Vance, RN" />
                </FactBoxTile>
              </FactBox>
            }
          />
        </div>

        {/* 3. Omnichannel Clinical Dock for Rapid On-Call Escalation */}
        <OmnichannelContactBar
          initialState="available"
          activeCaller={{
            callerNumber: "Ext. 4091 (Pharmacy)",
            customerName: "Central Inpatient Pharmacy",
            accountReference: "RX-QUEUE-ICU",
            serviceTier: "Clinical Safety Rapid Response",
          }}
          variant="docked"
          density="compact"
        />
      </div>
    );
  },
};
