import type { Meta, StoryObj } from "@storybook/react";
import { OpsShell, type OpsMetric, type OpsRailItem, type OpsDomain } from "./ops-shell";

const MOCK_RAIL: OpsRailItem[] = [
  { id: "overview", label: "Fleet Overview", href: "#", icon: "🌐" },
  { id: "tenants", label: "Tenant Clusters", href: "#", icon: "🏢" },
  { id: "database", label: "Postgres Shards", href: "#", icon: "🗄️" },
];

const MOCK_METRICS: OpsMetric[] = [
  { label: "Active Shards", value: "32 / 32" },
  { label: "P99 Latency", value: "24ms" },
  { label: "Global Uptime", value: "99.99%" },
];

const MOCK_DOMAINS: OpsDomain[] = [
  { id: "all", label: "All Regions", href: "#" },
  { id: "us-east", label: "US East (N. Virginia)", href: "#" },
  { id: "eu-west", label: "EU West (Frankfurt)", href: "#" },
];

const meta: Meta<typeof OpsShell> = {
  title: "Core/Shell/OpsShell",
  component: OpsShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    health: {
      control: "select",
      options: ["ok", "degraded", "down"],
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof OpsShell>;

export const Operational: Story = {
  args: {
    rail: MOCK_RAIL,
    activeRailId: "overview",
    metrics: MOCK_METRICS,
    health: "ok",
    domains: MOCK_DOMAINS,
    activeDomainId: "all",
    consoleLabel: "Operational Audit Stream",
    consoleErrors: 0,
    consoleWarnings: 2,
    console: <div style={{ padding: "16px", color: "var(--color-text-secondary)" }}>Stream connected. 0 fatal exceptions detected.</div>,
    children: (
      <div style={{ padding: "24px" }}>
        <h3>Cluster Telemetry Grid</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Real-time health monitor spanning 31 UniERP microservices.
        </p>
      </div>
    ),
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...Operational.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Healthy State (Green Strip)</h4>
        <div style={{ height: "360px", border: "1px solid var(--color-border)", position: "relative" }}>
          <OpsShell
            rail={MOCK_RAIL}
            activeRailId="overview"
            metrics={MOCK_METRICS}
            health="ok"
            domains={MOCK_DOMAINS}
            activeDomainId="all"
            consoleLabel="Console (0 errors)"
            consoleErrors={0}
            consoleWarnings={0}
            console={<div style={{ padding: "12px" }}>Healthy cluster state logs</div>}
          >
            <div style={{ padding: "16px" }}>All 32 shards operational. Zero degraded pods.</div>
          </OpsShell>
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Degraded State (Amber Strip with Failures)</h4>
        <div style={{ height: "360px", border: "1px solid var(--color-border)", position: "relative" }}>
          <OpsShell
            rail={MOCK_RAIL}
            activeRailId="database"
            metrics={[
              { label: "Active Shards", value: "28 / 32" },
              { label: "P99 Latency", value: "480ms" },
              { label: "Global Uptime", value: "99.20%" },
            ]}
            health="degraded"
            domains={MOCK_DOMAINS}
            activeDomainId="us-east"
            consoleLabel="Console"
            consoleErrors={3}
            consoleWarnings={7}
            console={<div style={{ padding: "12px", color: "var(--color-status-danger)" }}>3 connection pool exhaustion alerts detected</div>}
          >
            <div style={{ padding: "16px" }}>US-East shard 4 replica desynchronized. Rebalancing in progress.</div>
          </OpsShell>
        </div>
      </div>
    </div>
  ),
};
