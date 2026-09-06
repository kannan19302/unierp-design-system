import type { Meta, StoryObj } from "@storybook/react";
import { DataPipelineDagVisualizer } from "./data-pipeline-dag-visualizer";

const meta: Meta<typeof DataPipelineDagVisualizer> = {
  title: "Workflow/DataPipelineDagVisualizer",
  component: DataPipelineDagVisualizer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DataPipelineDagVisualizer>;

const sampleTasks = [
  {
    id: "extract_bank_feed",
    name: "Extract ISO 20022 Bank Feeds",
    operator: "SftpSensor",
    status: "success" as const,
    durationSeconds: 42,
    downstreamIds: ["stage_raw_transactions"],
    logsPreview: [
      "[2026-09-06 02:00:01] Connecting to JPMorgan Chase SFTP endpoint...",
      "[2026-09-06 02:00:15] Downloaded statement camt.053.20260906.xml (14.2 MB)",
      "[2026-09-06 02:00:42] Success: Staged to s3://unierp-bank-feeds/raw/",
    ],
  },
  {
    id: "stage_raw_transactions",
    name: "Stage & Decrypt Raw Feeds",
    operator: "SparkSubmit",
    status: "success" as const,
    durationSeconds: 180,
    upstreamIds: ["extract_bank_feed"],
    downstreamIds: ["dbt_reconcile_ledger"],
    logsPreview: [
      "[2026-09-06 02:01:00] Spark job unierp-feed-parser initialized with 16 executors",
      "[2026-09-06 02:03:50] Parsed 184,200 transaction records with AES-256 field decryption",
    ],
  },
  {
    id: "dbt_reconcile_ledger",
    name: "dbt Run: Ledger Reconciliation",
    operator: "dbtRunOperator",
    status: "failed" as const,
    durationSeconds: 65,
    retries: 1,
    maxRetries: 3,
    upstreamIds: ["stage_raw_transactions"],
    downstreamIds: ["publish_recon_metrics"],
    logsPreview: [
      "[2026-09-06 02:04:10] Running dbt build --select models.finance.reconciliation",
      "[2026-09-06 02:05:05] ERROR in model stg_settlement_discrepancies: DatabaseError: deadlock detected on table ledger_entries_partition_202609",
      "[2026-09-06 02:05:15] Task exited with returncode 1",
    ],
  },
  {
    id: "publish_recon_metrics",
    name: "Publish Prometheus SLA Metrics",
    operator: "PythonOperator",
    status: "upstream_failed" as const,
    upstreamIds: ["dbt_reconcile_ledger"],
  },
];

export const Default: Story = {
  args: {
    dagId: "financial_reconciliation_nightly",
    pipelineName: "Global Multi-Tenant Ledger Reconciliation & Settlement",
    scheduleInterval: "0 2 * * * (Daily at 02:00 UTC)",
    executionDate: "2026-09-06T02:00:00Z",
    tasks: sampleTasks,
    selectedTaskId: "dbt_reconcile_ledger",
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
