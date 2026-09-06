import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import {
  AuditLogForensicExplorer,
  type ForensicEvent,
} from "./audit-log-forensic-explorer";

const testEvents: ForensicEvent[] = [
  {
    id: "evt-1",
    timestamp: "2026-09-06T08:14:22Z",
    actorEmail: "secops.lead@unierp.internal",
    actorRole: "Security Admin",
    ipAddress: "198.51.100.44",
    geoCountry: "US",
    action: "kms.secret_key_rotated",
    targetResource: "keys/prod-db",
    result: "success",
    riskLevel: "medium",
    sha256Signature: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    userAgent: "KMS-Daemon",
  },
  {
    id: "evt-2",
    timestamp: "2026-09-06T08:12:05Z",
    actorEmail: "attacker@darknet.io",
    actorRole: "Unauthenticated",
    ipAddress: "185.220.101.5",
    geoCountry: "DE (Tor)",
    action: "auth.session_assumed",
    targetResource: "role/SuperAdmin",
    result: "denied",
    riskLevel: "high",
    sha256Signature: "112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00",
    userAgent: "Firefox",
  },
];

describe("AuditLogForensicExplorer", () => {
  it("renders audit table and forensic events accurately", () => {
    render(
      <AuditLogForensicExplorer
        title="Zero-Trust Audit Log"
        events={testEvents}
      />
    );

    expect(screen.getByText("Zero-Trust Audit Log")).toBeInTheDocument();
    expect(screen.getByText("secops.lead@unierp.internal")).toBeInTheDocument();
    expect(screen.getByText("attacker@darknet.io")).toBeInTheDocument();
    expect(screen.getByText("kms.secret_key_rotated")).toBeInTheDocument();
  });

  it("filters events when typing into search input", () => {
    render(
      <AuditLogForensicExplorer
        events={testEvents}
      />
    );

    const searchInput = screen.getByLabelText(/Search audit events/i);
    fireEvent.change(searchInput, { target: { value: "attacker" } });

    expect(screen.getByText("attacker@darknet.io")).toBeInTheDocument();
    expect(screen.queryByText("secops.lead@unierp.internal")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <AuditLogForensicExplorer
        events={testEvents}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
