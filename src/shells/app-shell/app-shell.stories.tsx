import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PlatformShell, type ShellTenant } from "./app-shell";
import { Button } from "../../primitives/button";
import { Search } from "lucide-react";

const meta: Meta<typeof PlatformShell> = {
  title: "Shells/PlatformShell",
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

const SAMPLE_TENANTS: ShellTenant[] = [
  { id: "t-100", name: "Acme Logistics Global" },
  { id: "t-200", name: "Acme European Operations" },
  { id: "t-300", name: "Acme Asia-Pacific Hub" },
];

function InteractiveSidebar({ activeItem = "Tenants", onItemClick }: { activeItem?: string; onItemClick?: (item: string) => void }) {
  const items = [
    { id: "Dashboard", label: "Dashboard", count: "" },
    { id: "Tenants", label: "Tenant Registry", count: "48" },
    { id: "Billing", label: "Billing & Invoices", count: "3" },
    { id: "IAM", label: "IAM & Access Policies", count: "" },
    { id: "Audit", label: "Immutable Audit Log", count: "Live" },
    { id: "Settings", label: "Global Settings", count: "" },
  ];

  return (
    <nav
      style={{
        inlineSize: 240,
        paddingBlock: "var(--space-4)",
        paddingInline: "var(--space-3)",
        borderInlineEnd: "1px solid var(--color-border)",
        blockSize: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
        background: "var(--color-bg-sunken)",
      }}
      aria-label="Platform Sidebar Navigation"
    >
      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", paddingInline: "var(--space-2)" }}>
        Platform Administration
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
        {items.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onItemClick?.(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  inlineSize: "100%",
                  paddingBlock: "var(--space-2)",
                  paddingInline: "var(--space-2-5, var(--space-3))",
                  border: "none",
                  borderRadius: "var(--radius-md)",
                  background: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--color-text-inverse, #ffffff)" : "var(--color-text)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "var(--text-xs)",
                  cursor: "pointer",
                  textAlign: "start",
                  transition: "background var(--duration-fast) var(--ease-default)",
                }}
              >
                <span>{item.label}</span>
                {item.count && (
                  <span
                    style={{
                      fontSize: "10px",
                      paddingBlock: "1px",
                      paddingInline: "var(--space-1-5, var(--space-1))",
                      borderRadius: "var(--radius-full, 999px)",
                      background: isActive ? "rgba(255,255,255,0.25)" : "var(--color-bg-elevated)",
                      color: isActive ? "#ffffff" : "var(--color-text-secondary)",
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function WorkspaceDashboard() {
  return (
    <div style={{ paddingBlock: "var(--space-6)", paddingInline: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Title & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "var(--space-3)" }}>
        <div>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, color: "var(--color-text)" }}>
            Tenant Admin Operating System
          </h2>
          <p style={{ margin: 0, marginTop: "var(--space-1)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
            Multi-tenant control plane, isolated key vaults, and real-time operational telemetry.
          </p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="secondary">Download Telemetry</Button>
          <Button variant="primary">Provision Tenant</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
        {[
          { label: "Active Enterprise Tenants", value: "48", badge: "+4 this month", tone: "var(--color-status-success, #16a34a)" },
          { label: "Contracted Monthly ARR", value: "$1.84M", badge: "99.2% collected", tone: "var(--color-status-success, #16a34a)" },
          { label: "P99 Gateway Latency", value: "14.2 ms", badge: "Optimal", tone: "var(--color-primary, #2563eb)" },
          { label: "Isolation Review", value: "Pending", badge: "Evidence required", tone: "var(--color-primary, #2563eb)" },
        ].map((card, idx) => (
          <div
            key={idx}
            style={{
              paddingBlock: "var(--space-4)",
              paddingInline: "var(--space-4)",
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-1)",
            }}
          >
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{card.label}</span>
            <span style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-text)", fontVariantNumeric: "tabular-nums" }}>
              {card.value}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 600, color: card.tone }}>{card.badge}</span>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <div style={{ paddingBlock: "var(--space-3)", paddingInline: "var(--space-4)", borderBlockEnd: "1px solid var(--color-border)", background: "var(--color-bg-sunken)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>Active Enterprise Tenants (RLS Guarded)</span>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Showing 3 of 48</span>
        </div>
        <table style={{ inlineSize: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead>
            <tr style={{ borderBlockEnd: "1px solid var(--color-border)", textAlign: "start", color: "var(--color-text-secondary)" }}>
              <th style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)" }}>Tenant Identifier</th>
              <th style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)" }}>Organization</th>
              <th style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)" }}>Region / Realm</th>
              <th style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: "t-100", name: "Acme Logistics Global", realm: "US-East-1", status: "Active" },
              { id: "t-200", name: "Acme European Operations", realm: "EU-Central-1", status: "Active" },
              { id: "t-300", name: "Acme Asia-Pacific Hub", realm: "AP-South-1", status: "Provisioning" },
            ].map((row) => (
              <tr key={row.id} style={{ borderBlockEnd: "1px solid var(--color-border)" }}>
                <td style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)", fontFamily: "monospace" }}>{row.id}</td>
                <td style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)", fontWeight: 600 }}>{row.name}</td>
                <td style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)" }}>{row.realm}</td>
                <td style={{ paddingBlock: "var(--space-2-5)", paddingInline: "var(--space-4)" }}>
                  <span style={{ paddingBlock: "2px", paddingInline: "var(--space-2)", borderRadius: "var(--radius-full, 999px)", background: row.status === "Active" ? "rgba(22, 163, 74, 0.12)" : "rgba(234, 179, 8, 0.12)", color: row.status === "Active" ? "var(--color-status-success, #16a34a)" : "var(--color-status-warning, #ca8a04)", fontWeight: 600, fontSize: "10px" }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InteractivePlatformShell(props: Partial<React.ComponentProps<typeof PlatformShell>>) {
  const [currentTenantId, setCurrentTenantId] = useState("t-100");
  const [activeNav, setActiveNav] = useState("Tenants");

  const currentTenant = SAMPLE_TENANTS.find((t) => t.id === currentTenantId) || SAMPLE_TENANTS[0];

  return (
    <PlatformShell
      platformName="Tenant Admin OS"
      accentColor="var(--color-primary)"
      user={{
        name: "Alex Morgan",
        email: "alex@acmelogistics.com",
      }}
      tenant={currentTenant}
      availableTenants={SAMPLE_TENANTS}
      onTenantChange={setCurrentTenantId}
      environmentLabel="Production"
      realmLabel="US-East"
      breadcrumbs={[
        { label: "Platform", href: "#" },
        { label: "Tenants", href: "#" },
        { label: currentTenant.name, isCurrent: true },
      ]}
      searchSlot={
        <div style={{ position: "relative", inlineSize: 220 }}>
          <Search size={14} style={{ position: "absolute", insetInlineStart: 8, insetBlockStart: 8, color: "var(--color-text-tertiary)" }} />
          <input
            type="text"
            placeholder="Search tenant or policy..."
            style={{
              inlineSize: "100%",
              blockSize: 28,
              paddingBlock: 0,
              paddingInlineStart: 28,
              paddingInlineEnd: 8,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-sunken)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text)",
            }}
          />
        </div>
      }
      sidebar={<InteractiveSidebar activeItem={activeNav} onItemClick={setActiveNav} />}
      platformWizardUrl="http://localhost:4000/"
      onSignOut={() => alert("Signing out from PlatformShell...")}
      {...props}
    >
      <WorkspaceDashboard />
    </PlatformShell>
  );
}

export const Default: Story = {
  render: () => <InteractivePlatformShell />,
};

export const InsetVariant: Story = {
  name: "Inset Variant (Benchmark Shell 2)",
  render: () => <InteractivePlatformShell variant="inset" />,
};

export const FloatingVariant: Story = {
  name: "Floating Variant (Benchmark Shell 5)",
  render: () => <InteractivePlatformShell variant="floating" />,
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          1. Standard Edge-to-Edge Variant (Benchmark Shell 1)
        </h4>
        <div style={{ blockSize: "440px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <InteractivePlatformShell variant="standard" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          2. Inset Sunken Workspace Card Variant (Benchmark Shell 2)
        </h4>
        <div style={{ blockSize: "440px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <InteractivePlatformShell variant="inset" />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          3. Floating Detached Panels Variant (Benchmark Shell 5)
        </h4>
        <div style={{ blockSize: "440px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
          <InteractivePlatformShell variant="floating" />
        </div>
      </div>
    </div>
  ),
};

export const RtlPreview: Story = {
  name: "RTL Preview",
  render: () => (
    <div dir="rtl" style={{ blockSize: "100dvh" }}>
      <InteractivePlatformShell />
    </div>
  ),
};
