import type { Meta, StoryObj } from "@storybook/react";
import { WebhookDeliveryAttemptLedger } from "./webhook-delivery-attempt-ledger";

const meta: Meta<typeof WebhookDeliveryAttemptLedger> = {
  title: "DataGrid/WebhookDeliveryAttemptLedger",
  component: WebhookDeliveryAttemptLedger,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WebhookDeliveryAttemptLedger>;

const mockAttempts = [
  {
    id: "att_90184a",
    eventId: "evt_inv_8829",
    eventType: "invoice.payment_succeeded",
    endpointUrl: "https://api.clientacme.com/v1/billing-webhooks",
    httpStatus: 200,
    latencyMs: 142,
    attemptNumber: 1,
    maxAttempts: 5,
    status: "DELIVERED" as const,
    timestamp: "2026-09-06T08:14:22Z",
    requestPayload: JSON.stringify(
      {
        id: "evt_inv_8829",
        type: "invoice.payment_succeeded",
        data: { object: { id: "in_1N4mK", amount_paid: 149000, currency: "usd" } },
      },
      null,
      2
    ),
    responseBody: JSON.stringify({ received: true, processed_at: "2026-09-06T08:14:22.142Z" }, null, 2),
  },
  {
    id: "att_90184b",
    eventId: "evt_sub_4102",
    eventType: "customer.subscription.renewed",
    endpointUrl: "https://webhooks.partnercorp.io/listener",
    httpStatus: 504,
    latencyMs: 15002,
    attemptNumber: 3,
    maxAttempts: 5,
    status: "RETRYING" as const,
    timestamp: "2026-09-06T08:12:00Z",
    requestPayload: JSON.stringify(
      {
        id: "evt_sub_4102",
        type: "customer.subscription.renewed",
        data: { subscriptionId: "sub_tier3_gold" },
      },
      null,
      2
    ),
    responseBody: "504 Gateway Timeout: upstream backend did not reply in 15000ms.",
  },
  {
    id: "att_90184c",
    eventId: "evt_usr_9918",
    eventType: "identity.mfa_device_enrolled",
    endpointUrl: "https://siem.security-hub.internal/events",
    httpStatus: 404,
    latencyMs: 89,
    attemptNumber: 5,
    maxAttempts: 5,
    status: "FAILED" as const,
    timestamp: "2026-09-06T07:55:10Z",
    requestPayload: JSON.stringify(
      { id: "evt_usr_9918", userId: "usr_sec_99" },
      null,
      2
    ),
    responseBody: "404 Not Found: endpoint /events was decommissioned.",
  },
];

export const Default: Story = {
  args: {
    attempts: mockAttempts,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    attempts: mockAttempts,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    attempts: mockAttempts,
    density: "comfortable",
  },
};
