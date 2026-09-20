import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StrataBar } from "../shell/strata-bar";
import { PageHeader } from "../layout/page-header";
import { ServiceHealthKpiGrid } from "../dashboard/service-health-kpi-grid";
import { KubernetesPodConsole } from "../workflow/kubernetes-pod-console";
import { FactBox, FactBoxTile, FactBoxField, FactBoxMetric } from "../layout/fact-box";
import { Badge } from "../primitives/badge";
import { Button } from "../primitives/button";
import { Activity, Server, Cpu, HardDrive, RefreshCw } from "lucide-react";

const meta: Meta = {
  title: "Screens/OperationsConsoleScreen",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const CloudOperationsCommandCenter: StoryObj = {
  render: () => {
    const [selectedContainer, setSelectedContainer] = useState("envoy-sidecar");

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* 1. Global Strata Breadcrumb Bar */}
        <StrataBar
          segments={["cluster-us-east-1", "production", "workloads", "api-gateway-7d4f9-k2px8"]}
          scope="manage"
          state={{
            kind: "warning",
            label: "Elevated Tail Latency (p99 412ms)",
          }}
          action={
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              <Button size="sm" variant="ghost">Restart Pod</Button>
              <Button size="sm" variant="danger">Drain Node</Button>
            </div>
          }
        />

        {/* 2. Page Header */}
        <div style={{ padding: "var(--space-4) var(--space-6) 0 var(--space-6)" }}>
          <PageHeader
            title="Kubernetes Service Telemetry & Pod Operations Console"
            subtitle="Namespace: production-ingress • Node: ip-10-0-14-88.ec2.internal • Region: us-east-1a"
            badge={<Badge variant="warning">Degraded SLA</Badge>}
            actions={
              <div style={{ display: "flex", gap: "var(--space-2)" }}>
                <Button variant="secondary" size="sm">
                  <RefreshCw size={14} style={{ marginRight: 6 }} /> Auto-Refresh (5s)
                </Button>
                <Button variant="primary" size="sm">Download Diagnostic Bundle</Button>
              </div>
            }
          />
        </div>

        {/* 3. Microservice Reliability Scorecard Grid */}
        <div style={{ padding: "var(--space-4) var(--space-6)" }}>
          <ServiceHealthKpiGrid
            title="Ingress Traffic & Gateway Reliability Metrics"
            metrics={[
              {
                id: "kpi-p99",
                title: "p99 Ingress Latency",
                value: "412 ms",
                target: "< 150 ms",
                status: "warning",
                change: "+84ms",
                changeType: "negative",
                progressPercent: 78,
                icon: <Activity size={18} />,
                subtitle: "Downstream auth proxy jitter",
              },
              {
                id: "kpi-sr",
                title: "Global Request Success Rate",
                value: "99.94%",
                target: "99.99%",
                status: "healthy",
                change: "+0.02%",
                changeType: "positive",
                progressPercent: 99.9,
                icon: <Server size={18} />,
                subtitle: "14.2M req / 24h",
              },
              {
                id: "kpi-cpu",
                title: "Node CPU Saturation",
                value: "72.4%",
                target: "< 80.0%",
                status: "healthy",
                change: "-4.1%",
                changeType: "positive",
                progressPercent: 72,
                icon: <Cpu size={18} />,
                subtitle: "32 vCPUs allocated",
              },
              {
                id: "kpi-oom",
                title: "Container Memory Pressure",
                value: "91.8%",
                target: "< 85.0%",
                status: "critical",
                change: "+12.3%",
                changeType: "negative",
                progressPercent: 92,
                icon: <HardDrive size={18} />,
                subtitle: "Approaching OOMKilled limit (1.84Gi / 2.0Gi)",
              },
            ]}
          />
        </div>

        {/* 4. Split View: Active Container Exec Terminal + Right FactBox Infrastructure Rail */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "var(--space-6)",
            padding: "0 var(--space-6) var(--space-6) var(--space-6)",
            flex: 1,
          }}
        >
          {/* Main Pod Terminal Console */}
          <div
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-4)",
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}
          >
            <KubernetesPodConsole
              podName="api-gateway-7d4f9-k2px8"
              namespace="production-ingress"
              containers={["gateway-core", "envoy-sidecar", "telemetry-agent"]}
              activeContainer={selectedContainer}
              onSelectContainer={setSelectedContainer}
              status="Running"
              restartCount={2}
              nodeName="ip-10-0-14-88.ec2.internal"
              density="compact"
              logs={[
                { id: "log-1", timestamp: "09:41:02.102", level: "info", message: "Envoy filter chain initialized for upstream pool [tier1-auth-svc]" },
                { id: "log-2", timestamp: "09:41:08.341", level: "info", message: "mTLS handshake verified: SPIFFE ID spiffe://cluster.local/ns/production/sa/api-gateway" },
                { id: "log-3", timestamp: "09:41:15.912", level: "warn", message: "Upstream connection pool exhaustion: retry quota threshold reached (active=1024, max=1024)" },
                { id: "log-4", timestamp: "09:41:22.409", level: "error", message: "HTTP 504 Gateway Timeout downstream for route /v1/billing/reconcile after 5000ms" },
                { id: "log-5", timestamp: "09:41:28.014", level: "info", message: "Circuit breaker tripped for cluster [finance-ledger-backend]; shedding 20% traffic" },
              ]}
            />
          </div>

          {/* Right FactBox Sidebar */}
          <div>
            <FactBox title="Kubernetes Inspector" density="compact">
              <FactBoxTile title="Pod Topology Details">
                <FactBoxField label="Pod CIDR IP" value="10.244.12.89" mono />
                <FactBoxField label="Host Node" value="ip-10-0-14-88.ec2.internal" mono />
                <FactBoxField label="QoS Class" value="Guaranteed" />
                <FactBoxField label="Runtime" value="containerd://1.6.28" mono />
              </FactBoxTile>

              <FactBoxTile title="Traffic Ingress Rate">
                <FactBoxMetric
                  label="Current Ingress RPS"
                  value="12,480 rps"
                  trend="up"
                  trendValue="+18%"
                  subtext="Target SLA < 25,000 rps per gateway replica"
                />
              </FactBoxTile>

              <FactBoxTile title="Target Service Affinity">
                <FactBoxField label="Service" value="gateway-ingress-public" />
                <FactBoxField label="Target Port" value="8443 → 8080 (TCP)" mono />
                <FactBoxField label="TLS Termination" value="Let's Encrypt (Automated)" />
              </FactBoxTile>
            </FactBox>
          </div>
        </div>
      </div>
    );
  },
};
