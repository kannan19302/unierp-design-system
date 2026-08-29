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
  title: "Shell/OpsShell",
  component: OpsShell,
  parameters: { layout: "fullscreen" },
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
