import type { Meta, StoryObj } from "@storybook/react";
import { PermissionMatrixForm } from "./permission-matrix-form";

const sampleRoles = ["Super Admin", "Finance Controller", "Sales Rep", "Auditor"];
const sampleResources = [
  "General Ledger",
  "Accounts Payable",
  "Sales Orders",
  "Payroll Runs",
  "Tax Filings",
];

const samplePermissions: Record<string, Record<string, boolean>> = {
  "Super Admin": {
    "General Ledger": true,
    "Accounts Payable": true,
    "Sales Orders": true,
    "Payroll Runs": true,
    "Tax Filings": true,
  },
  "Finance Controller": {
    "General Ledger": true,
    "Accounts Payable": true,
    "Sales Orders": false,
    "Payroll Runs": true,
    "Tax Filings": true,
  },
  "Sales Rep": {
    "General Ledger": false,
    "Accounts Payable": false,
    "Sales Orders": true,
    "Payroll Runs": false,
    "Tax Filings": false,
  },
  Auditor: {
    "General Ledger": true,
    "Accounts Payable": true,
    "Sales Orders": true,
    "Payroll Runs": false,
    "Tax Filings": true,
  },
};

const meta: Meta<typeof PermissionMatrixForm> = {
  title: "Platforms/TenantAdmin/PermissionMatrixForm",
  component: PermissionMatrixForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof PermissionMatrixForm>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: 700, paddingBlock: "var(--space-4)", paddingInline: "var(--space-4)" }}>
      <PermissionMatrixForm
        roles={sampleRoles}
        resources={sampleResources}
        permissions={samplePermissions}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 600, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <PermissionMatrixForm
        title="Custom Scope Matrix"
        roles={["Manager", "Staff"]}
        resources={["Reports", "Exports"]}
        permissions={{
          Manager: { Reports: true, Exports: true },
          Staff: { Reports: true, Exports: false },
        }}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 700, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Full Tenant Enterprise Matrix
        </h4>
        <PermissionMatrixForm
          roles={sampleRoles}
          resources={sampleResources}
          permissions={samplePermissions}
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Single Role Verification
        </h4>
        <PermissionMatrixForm
          title="Auditor-Only Scope"
          roles={["Auditor"]}
          resources={["General Ledger", "Tax Filings"]}
          permissions={{
            Auditor: { "General Ledger": true, "Tax Filings": true },
          }}
        />
      </div>
    </div>
  ),
};
