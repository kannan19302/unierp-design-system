import type { Meta, StoryObj } from "@storybook/react";
import { PlatformShell } from "./platform-shell";

const meta: Meta<typeof PlatformShell> = {
  title: "Shell/PlatformShell",
  component: PlatformShell,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PlatformShell>;

export const Default: Story = {
  args: {
    platformName: "Tenant Admin OS",
    accentColor: "var(--color-primary, #3b82f6)",
    user: {
      name: "Alex Morgan",
      email: "alex@acmelogistics.com",
    },
    tenant: {
      id: "t-100",
      name: "Acme Logistics Inc.",
    },
    availableTenants: [
      { id: "t-100", name: "Acme Logistics Inc." },
      { id: "t-200", name: "Acme EU Operations" },
    ],
    environmentLabel: "Production",
    realmLabel: "US-East",
    sidebar: (
      <div style={{ width: 220, padding: "var(--space-4)", borderRight: "1px solid var(--color-border-default)", height: "100%" }}>
        <p style={{ fontWeight: 600, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>NAVIGATION</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          <li><strong>Dashboard</strong></li>
          <li>Invoices & Billing</li>
          <li>Users & Permissions</li>
          <li>Settings</li>
        </ul>
      </div>
    ),
    children: (
      <div style={{ padding: "var(--space-6)" }}>
        <h2>Workspace Overview</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Universal navigation chrome applied across UniERP polyrepo delivery units.
        </p>
      </div>
    ),
  },
};
