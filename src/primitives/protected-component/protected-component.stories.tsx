import type { Meta, StoryObj } from "@storybook/react";
import { ProtectedComponent, ProtectedField, PermissionContext } from "./protected-component";

const meta: Meta<typeof ProtectedComponent> = {
  title: "Primitives/ProtectedComponent",
  component: ProtectedComponent,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProtectedComponent>;

export const Granted: Story = {
  render: () => (
    <PermissionContext.Provider value={{ permissions: ["finance.read"], resolvedAccess: null }}>
      <ProtectedComponent permission="finance.read" fallback={<div>Access Denied</div>}>
        <div style={{ padding: "var(--space-4)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
          Confidential Financial Data (Access Granted)
        </div>
      </ProtectedComponent>
    </PermissionContext.Provider>
  ),
};

export const Denied: Story = {
  render: () => (
    <PermissionContext.Provider value={{ permissions: ["sales.read"], resolvedAccess: null }}>
      <ProtectedComponent permission="finance.read" fallback={<div style={{ color: "var(--color-danger)", padding: "var(--space-4)", background: "var(--color-danger-light)", borderRadius: "var(--radius-md)" }}>Access Denied: Missing finance.read permission.</div>}>
        <div>Confidential Financial Data</div>
      </ProtectedComponent>
    </PermissionContext.Provider>
  ),
};

export const ReadonlyField: Story = {
  render: () => (
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
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1-5)" }}>
        <label style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          Invoice Total (Field-Level Security: Readonly)
        </label>
        <ProtectedField entity="invoice" field="total">
          <input
            defaultValue="$1,250.00"
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
    </PermissionContext.Provider>
  ),
};

export const EnterpriseAccessMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: 440 }}>
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
      <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)" }}>
        Role-Based Access Enforcement Demo
      </div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
        User Context: Role: <code>FINANCE_VIEWER</code> (Has: <code>general_ledger.view</code>, Lacks: <code>ledger.post</code>)
      </div>

      <PermissionContext.Provider
        value={{
          permissions: ["general_ledger.view"],
          resolvedAccess: {
            endpoints: [],
            pages: [],
            components: [],
            fields: { ledger: { amount: "readonly" } },
            recordFilters: {},
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <ProtectedComponent
            permission="general_ledger.view"
            fallback={<div>Access to Ledger View Denied</div>}
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
              [Authorized] General Ledger Records Viewable
            </div>
          </ProtectedComponent>

          <ProtectedComponent
            permission="ledger.post"
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
                [Protected] Post Journal Entry Action Hidden
              </div>
            }
          >
            <button type="button">Post Journal Entry</button>
          </ProtectedComponent>
        </div>
      </PermissionContext.Provider>
    </div>
  </div>
);
