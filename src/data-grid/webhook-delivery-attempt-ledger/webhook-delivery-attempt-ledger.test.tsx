import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { WebhookDeliveryAttemptLedger } from "./webhook-delivery-attempt-ledger";

const mockAttempts = [
  {
    id: "att_001",
    eventId: "evt_001",
    eventType: "invoice.paid",
    endpointUrl: "https://api.acme.com/webhooks",
    httpStatus: 200,
    latencyMs: 120,
    attemptNumber: 1,
    maxAttempts: 5,
    status: "DELIVERED" as const,
    timestamp: "2026-09-06T08:00:00Z",
    requestPayload: '{"id": "evt_001"}',
    responseBody: '{"ok": true}',
  },
  {
    id: "att_002",
    eventId: "evt_002",
    eventType: "customer.created",
    endpointUrl: "https://api.partner.io/events",
    httpStatus: 504,
    latencyMs: 5000,
    attemptNumber: 3,
    maxAttempts: 5,
    status: "RETRYING" as const,
    timestamp: "2026-09-06T08:05:00Z",
    requestPayload: '{"id": "evt_002"}',
    responseBody: "Gateway Timeout",
  },
];

describe("WebhookDeliveryAttemptLedger", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(<WebhookDeliveryAttemptLedger attempts={mockAttempts} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders table header and attempt rows", () => {
    render(<WebhookDeliveryAttemptLedger attempts={mockAttempts} />);
    expect(screen.getByText("Outbound Webhook Delivery & Retry Attempt Ledger")).toBeInTheDocument();
    expect(screen.getByText("att_001")).toBeInTheDocument();
    expect(screen.getByText("invoice.paid")).toBeInTheDocument();
    expect(screen.getByText("att_002")).toBeInTheDocument();
  });

  it("filters items using status dropdown", () => {
    render(<WebhookDeliveryAttemptLedger attempts={mockAttempts} />);
    const select = screen.getByLabelText("Filter by Status");

    fireEvent.change(select, { target: { value: "DELIVERED" } });
    expect(screen.getByText("att_001")).toBeInTheDocument();
    expect(screen.queryByText("att_002")).not.toBeInTheDocument();
  });

  it("toggles payload inspector on inspect click", () => {
    render(<WebhookDeliveryAttemptLedger attempts={mockAttempts} />);
    const inspectBtn = screen.getByLabelText("Inspect payload for attempt att_001");
    fireEvent.click(inspectBtn);

    expect(screen.getByText(/Payload & Response Inspector:/i)).toBeInTheDocument();
    expect(screen.getByText('{"id": "evt_001"}')).toBeInTheDocument();
    expect(screen.getByText('{"ok": true}')).toBeInTheDocument();
  });

  it("triggers replay callback when Replay button is clicked", () => {
    const handleReplay = vi.fn();
    render(<WebhookDeliveryAttemptLedger attempts={mockAttempts} onReplayAttempt={handleReplay} />);

    const replayBtn = screen.getByLabelText("Replay webhook event for attempt att_001");
    fireEvent.click(replayBtn);

    expect(handleReplay).toHaveBeenCalledWith("att_001");
  });
});
