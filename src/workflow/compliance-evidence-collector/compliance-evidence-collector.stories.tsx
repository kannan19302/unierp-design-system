import type { Meta, StoryObj } from "@storybook/react";
import {
  ComplianceEvidenceCollector,
  type ComplianceControlItem,
} from "./compliance-evidence-collector";

const mockControls: ComplianceControlItem[] = [
  {
    id: "ctrl-1",
    controlCode: "CC6.1",
    framework: "SOC 2 Type II",
    name: "Logical Access Control & SSO Enforcement",
    description: "The entity implements logical access security software, infrastructure, and architectures over protected information assets.",
    testStatus: "passing",
    lastTestedAt: "Today at 04:00 UTC",
    evidenceItems: [
      {
        id: "ev-1",
        filename: "okta-mfa-policy-enforcement-audit.json",
        fileSizeBytes: 48920,
        sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        uploadedAt: "2026-09-01",
        uploadedBy: "Security Automation Bot",
        expiresInDays: 85,
        reviewState: "approved",
      },
      {
        id: "ev-2",
        filename: "quarterly-user-access-deprovisioning-review.pdf",
        fileSizeBytes: 245100,
        sha256Hash: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
        uploadedAt: "2026-09-04",
        uploadedBy: "Devon Vance (Staff SecOps)",
        expiresInDays: 12,
        reviewState: "pending_review",
      },
    ],
  },
  {
    id: "ctrl-2",
    controlCode: "CC7.2",
    framework: "SOC 2 Type II",
    name: "Vulnerability Scanning & Penetration Testing",
    description: "Automated vulnerability scanning is performed weekly across production workloads, with high severity CVEs remediated within 7 days.",
    testStatus: "failing",
    lastTestedAt: "Yesterday at 22:30 UTC",
    evidenceItems: [
      {
        id: "ev-3",
        filename: "annual-external-pentest-report-redacted.pdf",
        fileSizeBytes: 1845000,
        sha256Hash: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
        uploadedAt: "2026-08-15",
        uploadedBy: "Bishop Fox Security Auditors",
        expiresInDays: 320,
        reviewState: "approved",
      },
    ],
  },
  {
    id: "ctrl-3",
    controlCode: "A.12.1",
    framework: "ISO 27001",
    name: "Immutable Database Backup & Restoration Testing",
    description: "Daily automated cryptographic database snapshots are transferred to air-gapped immutable storage and tested quarterly.",
    testStatus: "passing",
    lastTestedAt: "2026-09-05 02:00 UTC",
    evidenceItems: [],
  },
];

const meta: Meta<typeof ComplianceEvidenceCollector> = {
  title: "Workflow/ComplianceEvidenceCollector",
  component: ComplianceEvidenceCollector,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ComplianceEvidenceCollector>;

export const Default: Story = {
  args: {
    frameworkTitle: "SOC 2 Type II & ISO 27001 Continuous Audit Program",
    auditPeriod: "FY2026 Q3 Certification Cycle",
    controls: mockControls,
  },
};

export const Compact: Story = {
  args: {
    frameworkTitle: "HIPAA Security Rule Evidence Vault",
    auditPeriod: "Annual Recertification",
    controls: mockControls,
    density: "compact",
  },
};
