import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ProtectedComponent,
  ProtectedField,
  PermissionContext,
  AccessDeniedCard,
} from "./protected-component";
import { Badge } from "../badge";
import { Button } from "../button";

const meta: Meta<typeof ProtectedComponent> = {
  title: "Core/Primitives/ProtectedComponent",
  component: ProtectedComponent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### ProtectedComponent — Declarative RBAC Gating & Field-Level Security (FLS)

The **ProtectedComponent**, **ProtectedField**, and **AccessDeniedCard** primitives enforce server-authoritative role-based access control (RBAC) and field-level security (FLS) on the client, conditionally rendering controls, masking sensitive data, or rendering structured security cards based on resolved user scopes.

#### Strata Design Specifications
- **Granular Wildcards**: Supports explicit action codes (e.g. \`finance.read\`), hierarchical wildcards (\`finance.*\`), and universal super-admin bypass (\`*\`).
- **Standard Access Denied Card**: Employs an amber security card with scope identifier and "Request Permission Scope" workflow action.
- **Field-Level Security (FLS)**: Automatically marks fields read-only with a security padlock badge or redacts hidden fields with a secure mask.
- **Defense in Depth**: Client gating mirrors server authorization policies; all data modifications remain enforced by PostgreSQL RLS and server guards.
`,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    permission: {
      control: "text",
      description: "Permission code string required to reveal children.",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "finance.read" },
      },
    },
    showAccessDenied: {
      control: "boolean",
      description: "Whether to render standard AccessDeniedCard when user lacks scope.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProtectedComponent>;

type SimulatedRole = "SUPER_ADMIN" | "FINANCE_MANAGER" | "AUDITOR" | "SALES_GUEST";

function InteractiveRBACSimulator() {
  const [role, setRole] = useState<SimulatedRole>("FINANCE_MANAGER");

  const getRoleContext = (r: SimulatedRole) => {
    switch (r) {
      case "SUPER_ADMIN":
        return {
          permissions: ["*"],
          resolvedAccess: {
            endpoints: [],
            pages: [],
            components: [],
            fields: { invoice: { total: "editable" as const } },
            recordFilters: {},
          },
        };
      case "FINANCE_MANAGER":
        return {
          permissions: ["finance.*", "general_ledger.view", "ledger.post"],
          resolvedAccess: {
            endpoints: [],
            pages: [],
            components: [],
            fields: { invoice: { total: "editable" as const } },
            recordFilters: {},
          },
        };
      case "AUDITOR":
        return {
          permissions: ["general_ledger.view", "audit.read"],
          resolvedAccess: {
            endpoints: [],
            pages: [],
            components: [],
            fields: { invoice: { total: "readonly" as const } },
            recordFilters: {},
          },
        };
      case "SALES_GUEST":
        return {
          permissions: ["sales.leads.read"],
          resolvedAccess: {
            endpoints: [],
            pages: [],
            components: [],
            fields: { invoice: { total: "hidden" as const } },
            recordFilters: {},
          },
        };
    }
  };

  const contextValue = getRoleContext(role);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 480 }}>
      {/* Role Switcher Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--space-3)",
          background: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)" }}>
          Simulate User Role Scope:
        </span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as SimulatedRole)}
          style={{
            padding: "var(--space-1) var(--space-2)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-surface)",
            color: "var(--color-text)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-medium)",
          }}
        >
          <option value="SUPER_ADMIN">SUPER_ADMIN (Bypass: *)</option>
          <option value="FINANCE_MANAGER">FINANCE_MANAGER (finance.*)</option>
          <option value="AUDITOR">AUDITOR (Read-only + FLS Mask)</option>
          <option value="SALES_GUEST">SALES_GUEST (Denied)</option>
        </select>
      </div>

      <PermissionContext.Provider value={contextValue}>
        <div
          style={{
            padding: "var(--space-4)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-surface)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)" }}>
              General Ledger Journal Entry
            </span>
            <Badge variant="primary" size="sm">{role}</Badge>
          </div>

          {/* Protected Area 1: Ledger Posting Button */}
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
              1. Sensitive Ledger Mutation Action (Scope: <code>ledger.post</code>)
            </div>
            <ProtectedComponent
              permission="ledger.post"
              showAccessDenied
              onRequestAccess={() => alert("Scope request submitted to Tenant Administrator.")}
            >
              <Button variant="primary" size="sm">
                Post Reconciled Journal Batch ($48,250.00)
              </Button>
            </ProtectedComponent>
          </div>

          {/* Protected Area 2: FLS Protected Field */}
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>
              2. Field-Level Security Protection (Entity: <code>invoice</code>, Field: <code>total</code>)
            </div>
            <ProtectedField entity="invoice" field="total">
              <input
                defaultValue="$48,250.00 USD"
                style={{
                  width: "100%",
                  padding: "var(--space-1-5) var(--space-2-5)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-surface)",
                  color: "var(--color-text)",
                  fontSize: "var(--text-xs)",
                }}
              />
            </ProtectedField>
          </div>
        </div>
      </PermissionContext.Provider>
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveRBACSimulator />,
};

export const Granted: Story = {
  render: () => (
    <PermissionContext.Provider value={{ permissions: ["finance.read"], resolvedAccess: null }}>
      <ProtectedComponent permission="finance.read" showAccessDenied>
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text)",
          }}
        >
          Confidential Financial Data (Access Granted)
        </div>
      </ProtectedComponent>
    </PermissionContext.Provider>
  ),
};

export const Denied: Story = {
  render: () => (
    <PermissionContext.Provider value={{ permissions: ["sales.read"], resolvedAccess: null }}>
      <div style={{ width: 440 }}>
        <ProtectedComponent
          permission="finance.pnl.read"
          showAccessDenied
          onRequestAccess={() => alert("Scope request submitted to Tenant Admin.")}
        >
          <div>Confidential P&amp;L Data</div>
        </ProtectedComponent>
      </div>
    </PermissionContext.Provider>
  ),
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded anatomy of AccessDeniedCard: shield icon, permission scope badge, explanation copy, and permission request action.",
      },
    },
  },
  render: () => (
    <div style={{ width: 460 }}>
      <AccessDeniedCard
        permission="general_ledger.reconcile"
        title="Access Restricted by Policy"
        description="Your user account requires the general_ledger.reconcile role to perform fiscal ledger reconciliations."
        onRequestAccess={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "Full state matrix of ProtectedComponent and ProtectedField: Granted state, Access Denied card, Readonly FLS state, and Redacted field mask.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", width: 460 }}>
      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
          1. Granted Access State
        </div>
        <PermissionContext.Provider value={{ permissions: ["finance.read"], resolvedAccess: null }}>
          <ProtectedComponent permission="finance.read">
            <div style={{ padding: "var(--space-3) var(--space-4)", background: "var(--color-success-light)", border: "1px solid var(--color-success)", borderRadius: "var(--radius-md)", fontSize: "var(--text-xs)", color: "var(--color-success)" }}>
              [Authorized] Confidential Financial Data Cleared for Inspection
            </div>
          </ProtectedComponent>
        </PermissionContext.Provider>
      </div>

      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
          2. Access Denied State (Standard Enterprise Card)
        </div>
        <AccessDeniedCard
          permission="payroll.execute"
          title="Restricted Payroll Execution"
          description="Only authenticated CFO and HR Directors can dispatch active payroll runs."
          onRequestAccess={() => {}}
        />
      </div>

      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
          3. Field-Level Security: Read-Only with FLS Padlock Badge
        </div>
        <PermissionContext.Provider
          value={{
            permissions: ["*"],
            resolvedAccess: {
              endpoints: [],
              pages: [],
              components: [],
              fields: { invoice: { total: "readonly" } },
              recordFilters: {},
            },
          }}
        >
          <ProtectedField entity="invoice" field="total">
            <input
              defaultValue="$12,450.00 USD"
              readOnly
              style={{
                width: "100%",
                padding: "var(--space-1-5) var(--space-2-5)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-sunken)",
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-xs)",
              }}
            />
          </ProtectedField>
        </PermissionContext.Provider>
      </div>

      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>
          4. Field-Level Security: Redacted Mask (Hidden by Security Policy)
        </div>
        <PermissionContext.Provider
          value={{
            permissions: ["*"],
            resolvedAccess: {
              endpoints: [],
              pages: [],
              components: [],
              fields: { ssn: { value: "hidden" } },
              recordFilters: {},
            },
          }}
        >
          <ProtectedField entity="ssn" field="value">
            <input defaultValue="***-**-****" />
          </ProtectedField>
        </PermissionContext.Provider>
      </div>
    </div>
  ),
};
