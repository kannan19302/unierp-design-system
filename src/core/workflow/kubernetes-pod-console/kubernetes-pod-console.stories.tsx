import type { Meta, StoryObj } from "@storybook/react";
import {
  KubernetesPodConsole,
  type PodLogEntry,
} from "./kubernetes-pod-console";

const mockLogs: PodLogEntry[] = [
  {
    id: "l1",
    timestamp: "2026-09-06T04:12:01.204Z",
    level: "info",
    message: "Starting NestJS HTTP Application on port 3000...",
  },
  {
    id: "l2",
    timestamp: "2026-09-06T04:12:02.115Z",
    level: "info",
    message: "PostgreSQL connection pool initialized with 20 max connections.",
  },
  {
    id: "l3",
    timestamp: "2026-09-06T04:12:02.890Z",
    level: "info",
    message: "Keycloak JWT public key keyring rotated successfully.",
  },
  {
    id: "l4",
    timestamp: "2026-09-06T04:12:05.340Z",
    level: "warn",
    message: "Redis cache connection latency spiked to 45ms.",
  },
  {
    id: "l5",
    timestamp: "2026-09-06T04:12:08.771Z",
    level: "error",
    message: "Kafka consumer group 'finance-ledger-cg' rebalance timed out. Rejoining cluster.",
  },
  {
    id: "l6",
    timestamp: "2026-09-06T04:12:10.002Z",
    level: "info",
    message: "Health check /healthz responding HTTP 200 OK.",
  },
];

const meta: Meta<typeof KubernetesPodConsole> = {
  title: "Workflow/KubernetesPodConsole",
  component: KubernetesPodConsole,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof KubernetesPodConsole>;

export const Default: Story = {
  args: {
    podName: "unierp-api-79dfb8b4c-9zqwv",
    namespace: "production-us-west-2",
    containers: ["api-server", "envoy-sidecar", "telemetry-agent"],
    activeContainer: "api-server",
    status: "Running",
    restartCount: 0,
    logs: mockLogs,
    density: "compact",
  },
};

export const CrashLoopBackOff: Story = {
  args: {
    podName: "unierp-worker-db-sync-54b9d-47xpl",
    namespace: "production-us-west-2",
    containers: ["db-migration-runner"],
    status: "CrashLoopBackOff",
    restartCount: 7,
    logs: [
      {
        id: "err-1",
        timestamp: "2026-09-06T04:15:10.120Z",
        level: "error",
        message: "FATAL: Connection to postgresql-master.internal:5432 failed: ECONNREFUSED",
      },
      {
        id: "err-2",
        timestamp: "2026-09-06T04:15:10.122Z",
        level: "error",
        message: "Process exited with code 1. Container terminating.",
      },
    ],
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    ...Default.args,
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Kubernetes Pod Console Stream</h4>
        <KubernetesPodConsole
          podName="unierp-api-79dfb8b4c-9zqwv"
          namespace="production-us-west-2"
          containers={["api-server", "envoy-sidecar", "telemetry-agent"]}
          activeContainer="api-server"
          status="Running"
          restartCount={0}
          logs={mockLogs}
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Running Pod (Healthy)</h4>
        <KubernetesPodConsole
          podName="unierp-api-79dfb8b4c-9zqwv"
          namespace="production-us-west-2"
          containers={["api-server", "envoy-sidecar"]}
          status="Running"
          logs={mockLogs}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>CrashLoopBackOff Pod (Error)</h4>
        <KubernetesPodConsole
          podName="unierp-worker-db-sync-54b9d-47xpl"
          namespace="production-us-west-2"
          containers={["db-migration-runner"]}
          status="CrashLoopBackOff"
          restartCount={7}
          logs={[
            {
              id: "err-1",
              timestamp: "2026-09-06T04:15:10.120Z",
              level: "error",
              message: "FATAL: Connection to postgresql-master failed.",
            },
          ]}
          density="compact"
        />
      </div>
    </div>
  ),
};
