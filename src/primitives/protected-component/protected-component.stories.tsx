import type { Meta, StoryObj } from "@storybook/react";
import { ProtectedComponent, ProtectedField, PermissionContext } from "./protected-component";
import { Badge } from "../badge";
import { Button } from "../button";

const meta: Meta<typeof ProtectedComponent> = {
  title: "Primitives/ProtectedComponent",
  component: ProtectedComponent,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
### ProtectedComponent — Declarative Permission & FLS Gating

The **ProtectedComponent** and **ProtectedField** primitives enforce server-authoritative role-based access control (RBAC) and field-level security (FLS) on the client side, conditionally rendering controls or masking data based on resolved user scopes.

#### Strata Design Specifications
- **Granular Wildcards**: Resolves explicit action codes (e.g. \`finance.read\`), wildcard scopes (\`finance.*\`), and global super-admin bypass (\`*\`).
- **Field-Level Security (FLS)**: Via \`<ProtectedField />\`, automatically hides, marks read-only, or preserves editability based on entity attribute schemas.
- **Auditable Security Fallback**: Clean visual state for denied actions or hidden sensitive values without disrupting surrounding form layout.
- **Defense in Depth**: Client gating reflects server security policies; all mutations remain strictly enforced by API and database RLS.
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
    fallback: {
      control: false,
      description: "Optional JSX rendered when user lacks the required permission.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    children: {
      control: false,
      description: "Protected UI subtree rendered only when authorization passes.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProtectedComponent>;

export const Default: Story = {
  render: () => (
    <PermissionContext.Provider value={{ permissions: ["finance.read"], resolvedAccess: null }}>
      <ProtectedComponent
        permission="finance.read"
        fallback={<div>Access Denied</div>}
      >
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-xs)",
          }}
        >
          Confidential General Ledger Data (Access Granted)
        </div>
      </ProtectedComponent>
    </PermissionContext.Provider>
  ),
};

export const Granted: Story = {
  render: () => (
    <PermissionContext.Provider value={{ permissions: ["finance.read"], resolvedAccess: null }}>
      <ProtectedComponent permission="finance.read" fallback={<div>Access Denied</div>}>
        <div
          style={{
            padding: "var(--space-4)",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--text-xs)",
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
      <ProtectedComponent
        permission="finance.read"
        fallback={
          <div
            style={{
              color: "var(--color-danger)",
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-danger-light)",
              border: "1px solid var(--color-danger)",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--text-xs)",
            }}
          >
            Access Denied: Missing finance.read permission.
          </div>
        }
      >
        <div>Confidential Financial Data</div>
      </ProtectedComponent>
    </PermissionContext.Provider>
  ),
};

export const AnatomyAndComposition: Story = {
  parameters: {
    docs: {
      description: {
        story: "Exploded anatomy of ProtectedComponent and ProtectedField within an enterprise invoice form context.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", width: 440 }}>
      <div
        style={{
          border: "1px dashed var(--color-border-focus)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-4)",
          background: "var(--color-bg-subtle)",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-3)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-wider, 0.05em)",
          }}
        >
          Field-Level Security Anatomy (Editable vs Read-Only Masking)
        </div>
        <PermissionContext.Provider
          value={{
            permissions: ["invoice.*"],
            resolvedAccess: {
              endpoints: [],
              pages: [],
              components: [],
              fields: { invoice: { total: "readonly" } },
              recordFilters: {},
            },
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                Invoice Total (FLS: Readonly by Policy)
              </span>
              <ProtectedField entity="invoice" field="total">
                <input
                  defaultValue="$48,500.00"
                  readOnly
                  style={{
                    padding: "var(--space-1-5) var(--space-2-5)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-muted)",
                    color: "var(--color-text-muted)",
                    fontSize: "var(--text-xs)",
                  }}
                />
              </ProtectedField>
            </div>
          </div>
        </PermissionContext.Provider>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  parameters: {
    docs: {
      description: {
        story: "State matrix demonstrating Granted Access, Denied Fallback, and Multi-role Conditional Actions.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", width: 460 }}>
      <div>
        <div
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--space-2)",
          }}
        >
          1. Role Authorization Simulation (Role: AUDITOR)
        </div>
        <PermissionContext.Provider
          value={{
            permissions: ["audit.view"],
            resolvedAccess: {
              endpoints: [],
              pages: [],
              components: [],
              fields: { ledger: { amount: "readonly" } },
              recordFilters: {},
            },
          }}
        >
          <div
            style={{
              padding: "var(--space-4)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-surface)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)" }}>
                Financial Statement Inspection
              </span>
              <Badge variant="info" size="sm">AUDITOR</Badge>
            </div>

            <ProtectedComponent
              permission="audit.view"
              fallback={<div>Access to Audit Trail Denied</div>}
            >
              <div
                style={{
                  padding: "var(--space-2) var(--space-3)",
                  background: "var(--color-success-light)",
                  color: "var(--color-success)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "var(--text-xs)",
                }}
              >
                [Authorized] Audit logs visible to auditor
              </div>
            </ProtectedComponent>

            <ProtectedComponent
              permission="audit.purge"
              fallback={
                <div
                  style={{
                    padding: "var(--space-2) var(--space-3)",
                    background: "var(--color-bg-muted)",
                    color: "var(--color-text-muted)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "var(--text-xs)",
                  }}
                >
                  [Protected] Purge Audit Log Action Hidden (Requires COMPLIANCE_OFFICER)
                </div>
              }
            >
              <Button variant="danger" size="xs">Purge Records</Button>
            </ProtectedComponent>
          </div>
        </PermissionContext.Provider>
      </div>
    </div>
  ),
};
