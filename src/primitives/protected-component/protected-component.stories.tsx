import type { Meta, StoryObj } from "@storybook/react";
import { ProtectedComponent, ProtectedField, PermissionContext } from "./protected-component";

const meta: Meta<typeof ProtectedComponent> = {
  title: "COMPONENTS/ProtectedComponent",
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
        <div style={{ padding: "var(--space-4)", background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
          Confidential Financial Data (Access Granted)
        </div>
      </ProtectedComponent>
    </PermissionContext.Provider>
  ),
};

export const Denied: Story = {
  render: () => (
    <PermissionContext.Provider value={{ permissions: ["sales.read"], resolvedAccess: null }}>
      <ProtectedComponent permission="finance.read" fallback={<div style={{ color: "var(--color-danger)" }}>Access Denied</div>}>
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
      <ProtectedField entity="invoice" field="total">
        <input defaultValue="$1,250.00" readOnly />
      </ProtectedField>
    </PermissionContext.Provider>
  ),
};
