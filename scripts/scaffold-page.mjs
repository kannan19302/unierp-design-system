#!/usr/bin/env node
/**
 * UniERP Enterprise Page Scaffolder CLI (DL 2.0 Compliant)
 * Generates production-ready Next.js App Router pages utilizing approved @kannan19302/ui floorplans.
 *
 * Supported floorplan archetypes:
 *   - list: DataWorkspace / ListPageTemplate + FilterBar + DataTable + StatCardRow
 *   - record: RecordShell + ObjectPage + Key-Value Inspector Rail
 *   - transaction: TransactionWorkspace + Line Items Ledger + Summary Totals + Audit Actions
 *   - settings: SettingsShell + Keyword Index Nav + Form Pane + Dirty Footer
 *   - ops: OpsShell + Real-time Health Strip + Rail + Drawer Console
 *
 * Usage:
 *   node scripts/scaffold-page.mjs --name "InvoiceAudit" --template list --dry-run
 *   node scripts/scaffold-page.mjs --name "CustomerAccount" --template record --out ./src/app/customers/[id]/page.tsx
 *   node scripts/scaffold-page.mjs --name "JournalEntry" --template transaction --out ./src/app/gl/journals/new/page.tsx
 *   node scripts/scaffold-page.mjs --name "TenantPolicy" --template settings --dry-run
 *   node scripts/scaffold-page.mjs --name "ClusterTelemetry" --template ops --dry-run
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

function showHelp() {
  console.log(`
UniERP Enterprise Page Scaffolder CLI (DL 2.0)
==============================================
Generates strictly compliant Next.js App Router floorplans from @kannan19302/ui.

Options:
  --name <string>        Entity or feature name in TitleCase or kebab-case (e.g. "InvoiceAudit", "general-ledger")
  --template <type>      Floorplan archetype:
                           - list        : DataWorkspace / ListPageTemplate (default)
                           - record      : RecordShell + ObjectPage (Detail & Inspector)
                           - transaction : TransactionWorkspace (Double-entry / Document Ledger)
                           - settings    : SettingsShell (Keyword Search Nav + Form + Dirty Footer)
                           - ops         : OpsShell (Operational Control Plane + Status Strip)
  --target <app>         Target app context: "tenant-apps" (default), "tenant-admin", "provider-admin-os"
  --out <filepath>       Target destination file path to write generated TSX
  --dry-run              Print the generated TypeScript TSX to stdout without writing
  --help                 Show this help manual

Examples:
  node scripts/scaffold-page.mjs --name Invoices --template list --dry-run
  node scripts/scaffold-page.mjs --name CustomerProfile --template record --dry-run
  node scripts/scaffold-page.mjs --name JournalVoucher --template transaction --dry-run
  node scripts/scaffold-page.mjs --name SecurityPolicy --template settings --dry-run
  node scripts/scaffold-page.mjs --name NodeCluster --template ops --dry-run
`);
  process.exit(0);
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    showHelp();
  }

  const parsed = {
    name: "GeneralLedger",
    template: "list",
    target: "tenant-apps",
    out: null,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && args[i + 1]) parsed.name = args[++i];
    else if (args[i] === "--template" && args[i + 1]) parsed.template = args[++i].toLowerCase();
    else if (args[i] === "--target" && args[i + 1]) parsed.target = args[++i];
    else if (args[i] === "--out" && args[i + 1]) parsed.out = args[++i];
    else if (args[i] === "--dry-run") parsed.dryRun = true;
  }
  return parsed;
}

const config = parseArgs();
const kebabName = config.name.toLowerCase().replace(/[\s_]+/g, "-");
const pascalName = config.name.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
const humanTitle = config.name
  .replace(/[-_]+/g, " ")
  .replace(/([a-z])([A-Z])/g, "$1 $2")
  .replace(/\b\w/g, (c) => c.toUpperCase());

function generateListTemplate() {
  return `"use client";

import { useState } from "react";
import {
  ListPageTemplate,
  DataTable,
  type Column,
  StatCardRow,
  type StatCardItem,
  FilterBar,
  Badge,
  Button,
} from "@kannan19302/ui";

export interface ${pascalName}Record {
  id: string;
  code: string;
  name: string;
  status: "ACTIVE" | "PENDING" | "ARCHIVED";
  amount: number;
  updatedAt: string;
}

const columns: Column<${pascalName}Record>[] = [
  { key: "code", header: "Reference Code", sortable: true },
  { key: "name", header: "Description", sortable: true },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (r) => (
      <Badge
        variant={r.status === "ACTIVE" ? "success" : r.status === "PENDING" ? "warning" : "neutral"}
      >
        {r.status}
      </Badge>
    ),
  },
  {
    key: "amount",
    header: "Amount ($)",
    align: "right",
    sortable: true,
    render: (r) => \`$\${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}\`,
  },
  { key: "updatedAt", header: "Last Updated", sortable: true },
];

const stats: StatCardItem[] = [
  { id: "s1", label: "Total ${humanTitle} Records", value: "1,248" },
  { id: "s2", label: "Active / Approved", value: "1,180", trend: { value: 4.2, direction: "up" } },
  { id: "s3", label: "Pending Review", value: "68", trend: { value: 1.1, direction: "down" } },
];

export default function ${pascalName}ListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data] = useState<${pascalName}Record[]>([]);

  return (
    <ListPageTemplate
      title="${humanTitle}"
      subtitle="Manage, reconcile, and audit ${humanTitle} entity records."
      primaryAction={{
        label: "Create ${humanTitle}",
        onClick: () => alert("Create ${humanTitle} clicked"),
      }}
      metrics={<StatCardRow items={stats} />}
      filters={
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search ${humanTitle}..."
        />
      }
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey={(r) => r.id}
        emptyTitle="No ${humanTitle} Records Found"
        emptyMessage="Get started by adding your first ${humanTitle} record."
      />
    </ListPageTemplate>
  );
}
`;
}

function generateRecordTemplate() {
  return `"use client";

import { useState } from "react";
import {
  RecordShell,
  ObjectPage,
  type ObjectSection,
  PageHeader,
  Badge,
  Button,
  DescriptionList,
  type DescriptionItem,
} from "@kannan19302/ui";

const generalDetails: DescriptionItem[] = [
  { label: "Entity ID", value: "ENT-8921" },
  { label: "Classification", value: "Enterprise High-Priority" },
  { label: "Effective Date", value: "2026-09-01" },
  { label: "Currency", value: "USD ($)" },
];

const auditDetails: DescriptionItem[] = [
  { label: "Created By", value: "system.operator@unierp.internal" },
  { label: "Created At", value: "2026-09-01 08:30 UTC" },
  { label: "Hash Validation", value: "SHA-256 Verified" },
  { label: "Governance Compliance", value: "SOX-404 / SOC2 Type II" },
];

export default function ${pascalName}RecordPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections: ObjectSection[] = [
    {
      id: "overview",
      label: "General Overview",
      children: (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <DescriptionList items={generalDetails} columns={2} />
        </div>
      ),
    },
    {
      id: "audit",
      label: "Governance & Audit Trail",
      children: (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <DescriptionList items={auditDetails} columns={2} />
        </div>
      ),
    },
  ];

  return (
    <RecordShell
      density="compact"
      bar={
        <PageHeader
          title="${humanTitle} Record: REC-00941"
          description="Detailed record lifecycle, audit history, and associated sub-entities."
          badge={<Badge variant="success">APPROVED</Badge>}
          actions={
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button variant="secondary">Download PDF</Button>
              <Button variant="primary">Edit Record</Button>
            </div>
          }
        />
      }
      detail={<ObjectPage sections={sections} activeId={activeSection} />}
      inspector={
        <div style={{ padding: "var(--space-4)" }}>
          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-2)" }}>
            Quick Inspector
          </h3>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            Contextual telemetry and connected document associations.
          </p>
        </div>
      }
    />
  );
}
`;
}

function generateTransactionTemplate() {
  return `"use client";

import { useState } from "react";
import {
  TransactionWorkspace,
  type TransactionSummaryItem,
  DataTable,
  type Column,
  Button,
  Badge,
} from "@kannan19302/ui";

export interface TransactionLineItem {
  id: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
}

const lineColumns: Column<TransactionLineItem>[] = [
  { key: "account", header: "Account Code & Name", sortable: true },
  { key: "description", header: "Line Narrative", sortable: false },
  {
    key: "debit",
    header: "Debit ($)",
    align: "right",
    render: (r) => (r.debit > 0 ? \`$\${r.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}\` : "—"),
  },
  {
    key: "credit",
    header: "Credit ($)",
    align: "right",
    render: (r) => (r.credit > 0 ? \`$\${r.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}\` : "—"),
  },
];

const mockLines: TransactionLineItem[] = [
  { id: "1", account: "1010 - Cash & Equivalents", description: "Payment receipt settlement", debit: 45000.0, credit: 0.0 },
  { id: "2", account: "1200 - Accounts Receivable", description: "Settlement clearance", debit: 0.0, credit: 45000.0 },
];

const summaryTotals: TransactionSummaryItem[] = [
  { label: "Total Debit", value: "$45,000.00" },
  { label: "Total Credit", value: "$45,000.00" },
  { label: "Net Ledger Variance", value: "$0.00 (Balanced)", highlight: true },
];

export default function ${pascalName}TransactionPage() {
  const [lines] = useState<TransactionLineItem[]>(mockLines);

  return (
    <TransactionWorkspace
      title="${humanTitle} Document"
      subtitle="Double-entry general ledger voucher journal posting."
      documentNumber="JV-2026-0819"
      density="compact"
      segments={[
        { label: "Finance", href: "/finance" },
        { label: "General Ledger", href: "/finance/gl" },
        { label: "Voucher JV-2026-0819" },
      ]}
      state={{ label: "Draft - Pending Post", tone: "active" }}
      headerFields={
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          <div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Posting Period</span>
            <div style={{ fontWeight: "var(--weight-medium)" }}>FY2026-Q3</div>
          </div>
          <div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Transaction Date</span>
            <div style={{ fontWeight: "var(--weight-medium)" }}>2026-09-06</div>
          </div>
          <div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Currency</span>
            <div style={{ fontWeight: "var(--weight-medium)" }}>USD ($)</div>
          </div>
        </div>
      }
      summaryItems={summaryTotals}
      footerActions={
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="secondary">Save Draft</Button>
          <Button variant="primary">Post Transaction</Button>
        </div>
      }
    >
      <DataTable
        columns={lineColumns}
        data={lines}
        rowKey={(r) => r.id}
      />
    </TransactionWorkspace>
  );
}
`;
}

function generateSettingsTemplate() {
  return `"use client";

import { useState } from "react";
import {
  SettingsShell,
  type SettingsItem,
  Switch,
  Button,
} from "@kannan19302/ui";

const navItems: SettingsItem[] = [
  { id: "general", label: "General Settings", href: "#general", group: "Basics", keywords: ["name", "timezone", "locale"] },
  { id: "security", label: "Security & MFA", href: "#security", group: "Security", keywords: ["saml", "sso", "2fa", "auth"] },
  { id: "notifications", label: "Notifications & Webhooks", href: "#notifications", group: "Integration", keywords: ["alerts", "email", "slack"] },
];

export default function ${pascalName}SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [dirty, setDirty] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleToggle = (checked: boolean) => {
    setTwoFactorEnabled(checked);
    setDirty(true);
  };

  return (
    <SettingsShell
      items={navItems}
      activeId={activeTab}
      density="compact"
      dirty={dirty}
      onSave={() => {
        alert("Settings successfully saved.");
        setDirty(false);
      }}
      onDiscard={() => {
        setDirty(false);
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <div>
          <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)" }}>
            ${humanTitle} Configuration
          </h2>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            Manage policy enforcement rules, tenant defaults, and integration boundaries.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4)", background: "var(--color-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <div>
            <div style={{ fontWeight: "var(--weight-medium)" }}>Enforce Mandatory MFA</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              Require multi-factor authentication on all administrative roles.
            </div>
          </div>
          <Switch checked={twoFactorEnabled} onChange={handleToggle} />
        </div>
      </div>
    </SettingsShell>
  );
}
`;
}

function generateOpsTemplate() {
  return `"use client";

import { useState } from "react";
import {
  OpsShell,
  type OpsMetric,
  type OpsRailItem,
  type OpsHealth,
  type OpsDomain,
  Badge,
} from "@kannan19302/ui";
import { Server, Activity, ShieldAlert, Cpu } from "lucide-react";

const metrics: OpsMetric[] = [
  { label: "Cluster Health", value: <Badge variant="success">NORMAL (99.99%)</Badge> },
  { label: "Active Tenants", value: "482" },
  { label: "RPC Latency (p99)", value: "14.2 ms" },
  { label: "Worker Queue", value: "0 ms backlog" },
];

const rail: OpsRailItem[] = [
  { id: "overview", label: "Overview", icon: <Server size={18} />, href: "/ops" },
  { id: "telemetry", label: "Telemetry", icon: <Activity size={18} />, href: "/ops/telemetry" },
  { id: "compute", label: "Compute Nodes", icon: <Cpu size={18} />, href: "/ops/compute" },
  { id: "security", label: "Incident Response", icon: <ShieldAlert size={18} />, href: "/ops/incidents" },
];

const domains: OpsDomain[] = [
  { id: "d-us-east", label: "Cell us-east-1", href: "/ops?cell=us-east" },
  { id: "d-eu-west", label: "Cell eu-west-1", href: "/ops?cell=eu-west" },
  { id: "d-ap-southeast", label: "Cell ap-southeast-1", href: "/ops?cell=ap-southeast" },
];

export default function ${pascalName}OpsPage() {
  const [health] = useState<OpsHealth>("ok");

  return (
    <OpsShell
      density="compact"
      health={health}
      metrics={metrics}
      rail={rail}
      activeRailId="overview"
      domains={domains}
      activeDomainId="d-us-east"
      consoleLabel="System Event Stream"
      consoleErrors={0}
      consoleWarnings={1}
      console={
        <div style={{ padding: "var(--space-3)", fontFamily: "monospace", fontSize: "var(--text-xs)" }}>
          [2026-09-06 02:40:01 UTC] [INFO] Cell us-east-1 heartbeat acknowledged. 128 pods active.
        </div>
      }
    >
      <div style={{ padding: "var(--space-6)" }}>
        <h1 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", marginBottom: "var(--space-2)" }}>
          ${humanTitle} Operations Floorplan
        </h1>
        <p style={{ color: "var(--color-text-muted)" }}>
          Real-time telemetry and infrastructure cell control plane.
        </p>
      </div>
    </OpsShell>
  );
}
`;
}

let generatedCode = "";
switch (config.template) {
  case "record":
  case "detail":
    generatedCode = generateRecordTemplate();
    break;
  case "transaction":
  case "ledger":
    generatedCode = generateTransactionTemplate();
    break;
  case "settings":
  case "admin":
    generatedCode = generateSettingsTemplate();
    break;
  case "ops":
  case "operational":
    generatedCode = generateOpsTemplate();
    break;
  case "list":
  default:
    generatedCode = generateListTemplate();
    break;
}

if (config.dryRun || !config.out) {
  console.log(`\n/* =========================================================================`);
  console.log(`   UniERP Scaffolder: ${pascalName} (${config.template}) -> ${config.target}`);
  console.log(`   ========================================================================= */\n`);
  console.log(generatedCode);
  if (!config.dryRun && !config.out) {
    console.log(`[UniERP Page Scaffolder] TIP: Specify --out <path> to save directly to disk, or copy the above code.`);
  }
} else {
  const outPath = resolve(config.out);
  const outDir = dirname(outPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  writeFileSync(outPath, generatedCode, "utf8");
  console.log(`[UniERP Page Scaffolder] Successfully generated ${config.template} page at: ${outPath}`);
}
