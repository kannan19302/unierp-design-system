import type { Meta, StoryObj } from "@storybook/react";
import { ComputationalNotebookCell } from "./computational-notebook-cell";

const meta: Meta<typeof ComputationalNotebookCell> = {
  title: "DataDisplay/ComputationalNotebookCell",
  component: ComputationalNotebookCell,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ComputationalNotebookCell>;

export const SqlSuccess: Story = {
  args: {
    cellId: "cmd_01",
    language: "sql",
    initialCode: `-- Top 5 Revenue-Generating Enterprise Accounts
SELECT 
  account_id,
  tenant_name,
  subscription_tier,
  mrr_usd,
  last_payment_date
FROM billing_analytics.accounts
WHERE is_active = true
ORDER BY mrr_usd DESC
LIMIT 5;`,
    metrics: {
      executionTimeMs: 142,
      memoryUsedMb: 64,
      rowsAffected: 5,
    },
    outputData: {
      columns: ["account_id", "tenant_name", "subscription_tier", "mrr_usd", "last_payment_date"],
      rows: [
        ["acc_9901", "Stripe Global Inc", "ENTERPRISE_PLUS", 48500, "2026-09-01"],
        ["acc_9902", "Brex Treasury Corp", "ENTERPRISE", 32000, "2026-09-02"],
        ["acc_9903", "Anthropic PBC", "ENTERPRISE_PLUS", 75000, "2026-09-04"],
        ["acc_9904", "Datadog Cloud Ops", "SCALE", 18500, "2026-08-30"],
        ["acc_9905", "Snowflake Analytics", "ENTERPRISE", 29000, "2026-09-05"],
      ],
    },
    density: "compact",
  },
};

export const PythonError: Story = {
  args: {
    cellId: "cmd_02",
    language: "python",
    initialCode: `import polars as pl

df = pl.read_parquet("s3://warehouse/ledger_entries.parquet")
df_summary = df.filter(pl.col("amount") > 10000).group_by("currency").agg(pl.sum("amount"))
print(df_summary)`,
    metrics: {
      executionTimeMs: 38,
      memoryUsedMb: 128,
    },
    errorMessage: `Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
botocore.exceptions.NoCredentialsError: Unable to locate credentials in IAM task role or AWS_SECRET_ACCESS_KEY environment.`,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    cellId: "cmd_03",
    language: "sql",
    initialCode: "SELECT COUNT(*) FROM audit_logs WHERE timestamp >= NOW() - INTERVAL '1 hour';",
    metrics: {
      executionTimeMs: 12,
      memoryUsedMb: 16,
      rowsAffected: 1,
    },
    outputData: {
      columns: ["count"],
      rows: [[14029]],
    },
    density: "ultra-compact",
  },
};
