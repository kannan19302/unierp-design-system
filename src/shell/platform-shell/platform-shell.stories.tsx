import type { Meta, StoryObj } from "@storybook/react";
import { PlatformShell } from "./platform-shell";

const meta: Meta<typeof PlatformShell> = {
  title: "Shell/PlatformShell",
  component: PlatformShell,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "landmark-one-main", enabled: false },
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PlatformShell>;

export const Default: Story = {
  args: {
    platformName: "Tenant Admin OS",
    accentColor: "var(--color-primary)",
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
      <div style={{ width: 220, padding: "var(--space-4)", borderInlineEnd: "1px solid var(--color-border)", height: "100%" }}>
        <p style={{ fontWeight: "var(--font-weight-semibold)", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>NAVIGATION</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ height: "550px" }}>
      <PlatformShell
        platformName="Finance Core Platform"
        accentColor="var(--color-primary)"
        user={{
          name: "Kannan P",
          email: "kannan@acme.com",
        }}
        tenant={{
          id: "t-001",
          name: "Acme Global Treasury",
        }}
        availableTenants={[
          { id: "t-001", name: "Acme Global Treasury" },
          { id: "t-002", name: "Acme Americas LLC" },
        ]}
        environmentLabel="Staging"
        realmLabel="EU-Central"
        breadcrumbs={[
          { label: "Home", href: "#" },
          { label: "General Ledger", href: "#" },
          { label: "Journals", isCurrent: true },
        ]}
        sidebar={
          <div style={{ width: 220, padding: "var(--space-4)", borderInlineEnd: "1px solid var(--color-border)", height: "100%" }}>
            <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text-secondary)", marginBlockEnd: "var(--space-3)" }}>
              FINANCE SUITE
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-2)", fontSize: "var(--font-size-sm)" }}>
              <li>General Ledger</li>
              <li>Accounts Payable</li>
              <li>Accounts Receivable</li>
              <li>Cash Management</li>
            </ul>
          </div>
        }
      >
        <div style={{ padding: "var(--space-6)" }}>
          <h3>Platform Shell Frame Anatomy</h3>
          <p style={{ color: "var(--color-text-secondary)" }}>
            [1] Top Application Header with Brand & Suite Name | [2] Tenant & Environment Switcher | [3] Breadcrumbs & Global Search | [4] User Profile & Theme Quick Toggle | [5] Collapsible Navigation Sidebar | [6] Active Viewport Content Pane
          </p>
        </div>
      </PlatformShell>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Production Environment State
        </h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)" }}>
          <PlatformShell
            platformName="Developer OS"
            environmentLabel="Production"
            user={{ name: "System Admin", email: "admin@unierp.com" }}
            tenant={{ id: "prod-01", name: "UniERP Production" }}
          >
            <div style={{ padding: "var(--space-4)" }}>Production systems operational. 99.99% uptime.</div>
          </PlatformShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. Sandbox Environment & Notification Banner State
        </h4>
        <div style={{ height: "300px", border: "1px solid var(--color-border)" }}>
          <PlatformShell
            platformName="Marketplace Partner Portal"
            environmentLabel="Sandbox"
            realmLabel="AP-South"
            bannerSlot={
              <div style={{ background: "var(--color-warning-light)", color: "var(--color-warning-text)", padding: "var(--space-1-5) var(--space-4)", fontSize: "var(--font-size-xs)", textAlign: "center", borderBlockEnd: "1px solid var(--color-warning)" }}>
                Sandbox Test Mode: Simulated payment transactions only.
              </div>
            }
            user={{ name: "Partner Dev", email: "partner@app.io" }}
            tenant={{ id: "sb-1", name: "Partner Sandbox" }}
          >
            <div style={{ padding: "var(--space-4)" }}>Sandbox application testing enabled.</div>
          </PlatformShell>
        </div>
      </div>
    </div>
  ),
};
