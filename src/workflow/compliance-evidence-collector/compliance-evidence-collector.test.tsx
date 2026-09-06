import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  ComplianceEvidenceCollector,
  type ComplianceControlItem,
} from "./compliance-evidence-collector";

const testControls: ComplianceControlItem[] = [
  {
    id: "ctrl-1",
    controlCode: "CC6.1",
    framework: "SOC 2 Type II",
    name: "Logical Access Control",
    description: "The entity implements logical access security.",
    testStatus: "passing",
    lastTestedAt: "Today at 04:00 UTC",
    evidenceItems: [
      {
        id: "ev-1",
        filename: "access-audit.json",
        fileSizeBytes: 12000,
        sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        uploadedAt: "2026-09-01",
        uploadedBy: "SecOps",
        expiresInDays: 85,
        reviewState: "pending_review",
      },
    ],
  },
  {
    id: "ctrl-2",
    controlCode: "CC7.2",
    framework: "SOC 2 Type II",
    name: "Vulnerability Scanning",
    description: "Automated vulnerability scanning.",
    testStatus: "failing",
    lastTestedAt: "Yesterday",
    evidenceItems: [],
  },
];

describe("ComplianceEvidenceCollector", () => {
  it("renders framework title and controls list correctly", () => {
    render(
      <ComplianceEvidenceCollector
        frameworkTitle="SOC 2 Audit Vault"
        auditPeriod="FY2026"
        controls={testControls}
      />
    );

    expect(screen.getByText("SOC 2 Audit Vault")).toBeInTheDocument();
    expect(screen.getByText("FY2026")).toBeInTheDocument();
    expect(screen.getAllByText("CC6.1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("CC7.2")).toBeInTheDocument();
  });

  it("approves evidence artifact when sign-off button is clicked", () => {
    const onReview = vi.fn();
    render(
      <ComplianceEvidenceCollector
        controls={testControls}
        onReviewEvidence={onReview}
      />
    );

    const approveBtn = screen.getByRole("button", { name: /Approve Artifact/i });
    fireEvent.click(approveBtn);

    expect(onReview).toHaveBeenCalledWith("ctrl-1", "ev-1", "approved");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ComplianceEvidenceCollector
        frameworkTitle="SOC 2 Audit Vault"
        controls={testControls}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
