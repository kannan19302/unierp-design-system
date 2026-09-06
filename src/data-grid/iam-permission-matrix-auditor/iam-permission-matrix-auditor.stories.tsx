import type { Meta, StoryObj } from "@storybook/react";
import { IamPermissionMatrixAuditor } from "./iam-permission-matrix-auditor";

const meta: Meta<typeof IamPermissionMatrixAuditor> = {
  title: "Data Grid/IamPermissionMatrixAuditor",
  component: IamPermissionMatrixAuditor,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof IamPermissionMatrixAuditor>;

const samplePrincipals = [
  { id: "usr-1", name: "elena.rostova@unierp.internal", type: "user" as const, department: "SecOps Core" },
  { id: "usr-2", name: "marcus.vance@unierp.internal", type: "user" as const, department: "Finance Engineering" },
  { id: "role-1", name: "ProductionReleaseAutomationRole", type: "role" as const, department: "DevOps Cell" },
  { id: "sa-1", name: "sa-billing-settlement-daemon", type: "service_account" as const, department: "Fintech Core" },
];

const samplePermissions = [
  { id: "p-1", service: "S3", action: "GetObject", riskLevel: "low" as const, description: "Read objects from storage buckets" },
  { id: "p-2", service: "S3", action: "PutObject", riskLevel: "medium" as const, description: "Write new files to storage buckets" },
  { id: "p-3", service: "KMS", action: "Decrypt", riskLevel: "high" as const, description: "Decrypt field-level PII ciphertexts" },
  { id: "p-4", service: "IAM", action: "CreateAccessKey", riskLevel: "critical" as const, description: "Generate long-lived API credentials" },
  { id: "p-5", service: "PostgreSQL", action: "DropTable", riskLevel: "critical" as const, description: "Destructive DDL table drop command" },
  { id: "p-6", service: "Billing", action: "ApproveDisbursement", riskLevel: "high" as const, description: "Authorize bank wire transfer batches" },
];

const sampleMatrix = {
  "usr-1__p-1": { decision: "allow" as const, policySource: "SecOpsReadOnlyPolicy" },
  "usr-1__p-2": { decision: "allow" as const, policySource: "SecOpsContributorPolicy" },
  "usr-1__p-3": { decision: "allow" as const, policySource: "KeyCustodianPolicy" },
  "usr-1__p-4": { decision: "explicit_deny" as const, policySource: "OrgRootServiceControlPolicy" },
  "usr-1__p-5": { decision: "deny" as const },
  "usr-1__p-6": { decision: "deny" as const },
  "usr-2__p-1": { decision: "allow" as const, policySource: "GeneralStaffPolicy" },
  "usr-2__p-6": { decision: "allow" as const, policySource: "FinanceControllerPolicy" },
};

export const Default: Story = {
  args: {
    principals: samplePrincipals,
    permissions: samplePermissions,
    matrix: sampleMatrix,
    selectedPrincipalId: "usr-1",
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const Standard: Story = {
  args: {
    ...Default.args,
    density: "standard",
  },
};
