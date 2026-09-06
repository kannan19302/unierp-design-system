import type { Meta, StoryObj } from "@storybook/react";
import { DistributedTraceFlameGraph } from "./distributed-trace-flame-graph";

const meta: Meta<typeof DistributedTraceFlameGraph> = {
  title: "Data Display/DistributedTraceFlameGraph",
  component: DistributedTraceFlameGraph,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DistributedTraceFlameGraph>;

const sampleSpans = [
  {
    id: "span-root",
    serviceName: "api-gateway",
    operationName: "POST /api/v1/finance/payouts/batch-execute",
    startTimeMs: 0,
    durationMs: 480,
    statusCode: "ok" as const,
    depth: 0,
    attributes: {
      "http.method": "POST",
      "http.route": "/api/v1/finance/payouts/batch-execute",
      "http.status_code": 200,
      "tenant.id": "tenant-enterprise-acme",
      "user.id": "usr-finance-controller",
    },
  },
  {
    id: "span-auth",
    parentId: "span-root",
    serviceName: "idp-service",
    operationName: "ValidateBearerToken & EnforceRBAC",
    startTimeMs: 15,
    durationMs: 45,
    statusCode: "ok" as const,
    depth: 1,
    attributes: {
      "auth.permission": "finance:payout:execute",
      "auth.strategy": "jwt_asymmetric_rs256",
      "cache.hit": true,
    },
  },
  {
    id: "span-service",
    parentId: "span-root",
    serviceName: "finance-service",
    operationName: "ExecuteDisbursementBatch",
    startTimeMs: 65,
    durationMs: 400,
    statusCode: "ok" as const,
    depth: 1,
    attributes: {
      "payout.batch_id": "BATCH-2026-09-001",
      "payout.currency": "USD",
      "payout.total_items": 42,
    },
  },
  {
    id: "span-db-tx",
    parentId: "span-service",
    serviceName: "postgres-primary",
    operationName: "BEGIN; SELECT * FROM bank_accounts FOR UPDATE",
    startTimeMs: 75,
    durationMs: 80,
    statusCode: "ok" as const,
    depth: 2,
    attributes: {
      "db.system": "postgresql",
      "db.name": "unierp_finance_prod",
      "db.rows_affected": 42,
    },
  },
  {
    id: "span-wire",
    parentId: "span-service",
    serviceName: "stripe-ach-client",
    operationName: "POST /v1/transfers/batch",
    startTimeMs: 165,
    durationMs: 250,
    statusCode: "ok" as const,
    depth: 2,
    attributes: {
      "peer.service": "api.stripe.com",
      "http.status_code": 200,
      "network.transport": "tls1.3",
    },
  },
  {
    id: "span-kafka",
    parentId: "span-service",
    serviceName: "kafka-cluster",
    operationName: "Produce event: finance.payout.batch_disbursed",
    startTimeMs: 420,
    durationMs: 35,
    statusCode: "ok" as const,
    depth: 2,
    attributes: {
      "messaging.system": "kafka",
      "messaging.destination": "finance.payout.batch_disbursed",
      "messaging.partitions": 12,
    },
  },
];

export const Default: Story = {
  args: {
    traceId: "4bf92f3577b34da6a3ce929d0e0e4736",
    rootServiceName: "api-gateway",
    totalDurationMs: 480,
    spans: sampleSpans,
    selectedSpanId: "span-root",
    density: "compact",
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    spans: [
      ...sampleSpans.slice(0, 4),
      {
        id: "span-wire-error",
        parentId: "span-service",
        serviceName: "stripe-ach-client",
        operationName: "POST /v1/transfers/batch",
        startTimeMs: 165,
        durationMs: 120,
        statusCode: "error" as const,
        depth: 2,
        errorMessage: "NetworkTimeoutException: Gateway timed out after 120ms during idempotency token handshake.",
        attributes: {
          "peer.service": "api.stripe.com",
          "http.status_code": 504,
          "error": true,
        },
      },
    ],
  },
};
