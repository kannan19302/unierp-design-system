import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StrataBar } from "../../../core/shell/strata-bar";
import { WorkspaceTabs } from "../../../core/layout/workspace-tabs";
import { PageHeader } from "../../../core/layout/page-header";
import { StatCardRow } from "../../../core/layout/stat-card-row";
import { MatterTrustLedger, type TrustLedgerEntry } from "../legal-compliance/matter-trust-ledger";
import { FactBox, FactBoxTile, FactBoxField, FactBoxMetric } from "../../../core/layout/fact-box";
import { OmnichannelContactBar } from "../../../core/layout/omnichannel-contact-bar";
import { Badge } from "../../../core/primitives/badge";
import { Button } from "../../../core/primitives/button";
import { DollarSign, ShieldCheck, ArrowUpRight, Scale, Clock, FileText } from "lucide-react";

const meta: Meta = {
  title: "Platforms/BusinessSuite/Finance/FinanceLedgerScreen",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

const SAMPLE_ENTRIES: TrustLedgerEntry[] = [
  {
    id: "TR-8819",
    date: "2026-09-02",
    type: "retainer_deposit",
    payeeOrPayor: "Acme Global Holdings Corp",
    description: "Series B M&A Regulatory Escrow Retainer",
    amount: 50000.0,
    runningTrustBalance: 50000.0,
    voucherRef: "VCH-TR-8819",
    reconciliationStatus: "cleared",
  },
  {
    id: "TR-8820",
    date: "2026-09-05",
    type: "disbursement_expense",
    payeeOrPayor: "Apex Expert Witness Consulting LLC",
    description: "Antitrust Economic Impact Analysis (Phase 1)",
    amount: -8500.0,
    runningTrustBalance: 41500.0,
    voucherRef: "VCH-TR-8820",
    reconciliationStatus: "cleared",
  },
  {
    id: "TR-8821",
    date: "2026-09-11",
    type: "earned_fees_transfer",
    payeeOrPayor: "Operating Operating Account (UniERP)",
    description: "Earned Legal Fees Billing Cycle (Invoice #INV-2026-091)",
    amount: -12400.0,
    runningTrustBalance: 29100.0,
    voucherRef: "VCH-TR-8821",
    reconciliationStatus: "cleared",
  },
  {
    id: "TR-8822",
    date: "2026-09-17",
    type: "retainer_deposit",
    payeeOrPayor: "Acme Global Holdings Corp",
    description: "Replenishment Escrow Deposit",
    amount: 25000.0,
    runningTrustBalance: 54100.0,
    voucherRef: "VCH-TR-8822",
    reconciliationStatus: "pending_transit",
  },
];

export const EnterpriseFinanceWorkbench: StoryObj = {
  render: () => {
    const [activeTab, setActiveTab] = useState("matter-trust");

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
        {/* 1. Global Strata Breadcrumb / Address Bar */}
        <StrataBar
          segments={["finance", "treasury", "client-escrow", "MATTER-7702-ACME"]}
          scope="app"
          state={{
            kind: "success",
            label: "IOLTA Three-Way Reconciled",
          }}
          action={
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
              <Button size="sm" variant="ghost">Export Ledger</Button>
              <Button size="sm" variant="primary">Record Disbursement</Button>
            </div>
          }
        />

        {/* 2. Workspace Multi-Document Session Tabs */}
        <WorkspaceTabs
          tabs={[
            { id: "matter-trust", title: "MATTER-7702 (Acme Corp)", icon: <Scale size={13} />, dirty: false, pinned: true },
            { id: "batch-recon", title: "Sept Batch Reconciliation", icon: <FileText size={13} />, dirty: true },
            { id: "audit-stream", title: "Trust Audit Trail", icon: <Clock size={13} /> },
          ]}
          activeTabId={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* 3. Screen Page Header with Integrated Actions and Status */}
        <div style={{ padding: "var(--space-3) var(--space-6) 0 var(--space-6)", borderBottom: "1px solid var(--color-border-default)", background: "var(--color-bg-elevated)" }}>
          <PageHeader
            title="Matter IOLTA Trust Accounting & Escrow Ledger"
            subtitle="Acme Global Holdings Corp • Corporate Reorganization & Antitrust Defense"
            badge={<Badge variant="success">IOLTA Compliant</Badge>}
            actions={
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="secondary" size="sm">Audit Log</Button>
                <Button variant="primary" size="sm">Replenish Retainer</Button>
              </div>
            }
          />
        </div>

        {/* 4. Executive KPI Stat Cards — Seamless Hairline Strip */}
        <div style={{ padding: "var(--space-4) var(--space-6)", background: "var(--color-bg)" }}>
          <StatCardRow
            columns={4}
            stats={[
              {
                label: "Current Trust Balance",
                value: "$54,100.00",
                change: 14.2,
                changeLabel: "vs prior month",
                icon: <DollarSign size={15} />,
                color: "var(--color-primary)",
              },
              {
                label: "Minimum Retainer Floor",
                value: "$10,000.00",
                change: 0,
                changeLabel: "Contractual buffer",
                icon: <ShieldCheck size={15} />,
                color: "var(--color-success)",
              },
              {
                label: "Pending Transit Float",
                value: "$25,000.00",
                change: -5.4,
                changeLabel: "1 transaction awaiting ACH",
                icon: <Clock size={15} />,
                color: "var(--color-warning)",
              },
              {
                label: "Total Earned Disbursements",
                value: "$20,900.00",
                change: 8.7,
                changeLabel: "Transferred to operating",
                icon: <ArrowUpRight size={15} />,
                color: "var(--color-info)",
              },
            ]}
          />
        </div>

        {/* 5. Main Body: Split View with Matter Trust Ledger and FactBox Rail */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 0,
            borderTop: "1px solid var(--color-border-default)",
            background: "var(--color-bg-elevated)",
            flex: 1,
          }}
        >
          {/* Main Grid View */}
          <div
            style={{
              padding: "var(--space-5)",
              overflow: "auto",
            }}
          >
            <MatterTrustLedger
              matterId="MAT-7702"
              matterName="Acme Corp Antitrust Compliance"
              clientName="Acme Global Holdings Corp"
              minimumRetainerThreshold={10000}
              ioltaBankBalance={54100}
              entries={SAMPLE_ENTRIES}
              density="compact"
            />
          </div>

          {/* Right Context FactBox Sidebar Docked Flush */}
          <div style={{ borderLeft: "1px solid var(--color-border-default)", background: "var(--color-bg)" }}>
            <FactBox title="Account Intelligence" density="compact">
              <FactBoxTile title="Three-Way Balance Check">
                <FactBoxMetric
                  label="Reconciled Bank Float"
                  value="$54,100.00"
                  trend="up"
                  trendValue="Balanced"
                  subtext="Matched against JPMorgan Chase #4491"
                />
                <div style={{ marginTop: "var(--space-3)" }}>
                  <FactBoxField label="Escrow Account" value="JPMC - IOLTA #4491" mono />
                  <FactBoxField label="Jurisdiction" value="State Bar of California" />
                  <FactBoxField label="Next Audit" value="2026-10-01" highlight />
                </div>
              </FactBoxTile>

              <FactBoxTile title="Billing Entity Metadata">
                <FactBoxField label="Lead Partner" value="Sarah Jenkins, Esq." />
                <FactBoxField label="Billing Model" value="Retainer Escrow with Monthly Offset" />
                <FactBoxField label="Credit Limit" value="$250,000" mono />
              </FactBoxTile>
            </FactBox>
          </div>
        </div>

        {/* 6. Docked Omnichannel Contact Bar */}
        <OmnichannelContactBar
          initialState="in_call"
          activeCaller={{
            callerNumber: "+1 (415) 890-2134",
            customerName: "David Sterling (Treasurer, Acme)",
            accountReference: "MAT-7702",
            serviceTier: "Enterprise Platinum SLA",
          }}
          callDurationSeconds={142}
          variant="docked"
          density="compact"
        />
      </div>
    );
  },
};
