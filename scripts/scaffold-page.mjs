#!/usr/bin/env node
/**
 * UniERP Page Scaffolder CLI (DL 2.0 Compliant)
 * Generates enterprise-standard Next.js App Router pages utilizing approved @kannan19302/ui templates.
 *
 * Usage:
 *   node scripts/scaffold-page.mjs --name "Invoices" --template list-detail --target tenant-apps
 */

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    name: "GeneralLedger",
    template: "list",
    target: "tenant-apps",
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && args[i + 1]) parsed.name = args[++i];
    if (args[i] === "--template" && args[i + 1]) parsed.template = args[++i];
    if (args[i] === "--target" && args[i + 1]) parsed.target = args[++i];
  }
  return parsed;
}

const config = parseArgs();
const kebabName = config.name.toLowerCase().replace(/\s+/g, "-");
const pascalName = config.name.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));

console.log(`[UniERP Page Scaffolder] Generating ${config.template} page: ${pascalName} for ${config.target}...`);

const listPageCode = `"use client";

import { useState } from "react";
import {
  ListPageTemplate,
  DataTable,
  type Column,
  StatCardRow,
  type StatCardItem,
  FilterBar,
} from "@kannan19302/ui";

interface ${pascalName}Record {
  id: string;
  code: string;
  name: string;
  status: string;
  amount: number;
  updatedAt: string;
}

const columns: Column<${pascalName}Record>[] = [
  { key: "code", header: "Reference Code", sortable: true },
  { key: "name", header: "Description", sortable: true },
  { key: "status", header: "Status", sortable: true },
  {
    key: "amount",
    header: "Amount ($)",
    align: "right",
    sortable: true,
    render: (r) => \`$\${r.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}\`,
  },
  { key: "updatedAt", header: "Last Updated", sortable: true },
];

const mockStats: StatCardItem[] = [
  { id: "s1", label: "Total ${pascalName} Records", value: "1,248" },
  { id: "s2", label: "Active / Approved", value: "1,180", trend: { value: 4.2, direction: "up" } },
  { id: "s3", label: "Pending Review", value: "68", trend: { value: 1.1, direction: "down" } },
];

export default function ${pascalName}Page() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ListPageTemplate
      title="${config.name}"
      subtitle="Manage, reconcile, and audit ${config.name} entity records."
      primaryAction={{
        label: "Create New ${pascalName}",
        onClick: () => alert("Create action triggered"),
      }}
      metrics={<StatCardRow items={mockStats} />}
      filters={
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search ${config.name}..."
        />
      }
    >
      <DataTable
        columns={columns}
        data={[]}
        rowKey={(r) => r.id}
        emptyTitle="No ${config.name} Records Found"
        emptyMessage="Get started by creating your first ${pascalName} record."
      />
    </ListPageTemplate>
  );
}
`;

console.log(`[UniERP Page Scaffolder] Successfully generated code schema for ${pascalName}.`);
