import type { Meta, StoryObj } from "@storybook/react";
import {
  AuditLogForensicExplorer,
  type ForensicEvent,
} from "./audit-log-forensic-explorer";

const mockEvents: ForensicEvent[] = [
  {
    id: "evt-1",
    timestamp: "2026-09-06T08:14:22Z",
    actorEmail: "secops.lead@unierp.internal",
    actorRole: "Global Security Administrator",
    ipAddress: "198.51.100.44",
    geoCountry: "US (San Francisco)",
    action: "kms.secret_key_rotated",
    targetResource: "arn:aws:kms:us-east-1:keys/prod-database-master",
    result: "success",
    riskLevel: "medium",
    sha256Signature: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    userAgent: "UniERP-KMS-Daemon/2.4 (x86_64-linux-gnu)",
    previousState: { version: "v14", status: "retired" },
    newState: { version: "v15", status: "active", algorithm: "AES_256_GCM" },
  },
  {
    id: "evt-2",
    timestamp: "2026-09-06T08:12:05Z",
    actorEmail: "anonymous.attacker@darknet.io",
    actorRole: "Unauthenticated",
    ipAddress: "185.220.101.5",
    geoCountry: "DE (Tor Exit Relay)",
    action: "auth.privileged_session_assumed",
    targetResource: "role/ProviderSuperAdmin",
    result: "denied",
    riskLevel: "high",
    sha256Signature: "112233445566778899aabbccddeeff00112233445566778899aabbccddeeff00",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0",
    previousState: { mfaPassed: false },
    newState: { reason: "MFA_CHALLENGE_FAILED_INVALID_TOTP" },
  },
  {
    id: "evt-3",
    timestamp: "2026-09-06T07:45:18Z",
    actorEmail: "billing.clerk@tenant-apex.com",
    actorRole: "Tenant Billing Operator",
    ipAddress: "203.0.113.12",
    geoCountry: "GB (London)",
    action: "invoice.approved_and_queued",
    targetResource: "invoice/INV-2026-8812",
    result: "success",
    riskLevel: "low",
    sha256Signature: "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
    userAgent: "UniERP-Web-Client/1.4.0 (Chrome 128)",
  },
];

const meta: Meta<typeof AuditLogForensicExplorer> = {
  title: "DataGrid/AuditLogForensicExplorer",
  component: AuditLogForensicExplorer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuditLogForensicExplorer>;

export const Default: Story = {
  args: {
    title: "Immutable Zero-Trust Forensic Audit Ledger",
    events: mockEvents,
  },
};

export const HighRiskThreats: Story = {
  args: {
    title: "Anomalous Security Violations (Threat Triage)",
    events: mockEvents.filter((e) => e.riskLevel === "high"),
    density: "compact",
  },
};
