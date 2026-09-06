import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { MerkleProofAuditTrailVerifier } from "./merkle-proof-audit-trail-verifier";

const mockTarget = {
  leafIndex: 12,
  entityId: "TX-JOURNAL-01",
  leafHash: "abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234",
  timestamp: "2026-09-06T08:00:00Z",
  authorizingKey: "0x1234567890abcdef",
  proofPath: [
    {
      level: 1,
      position: "RIGHT" as const,
      hash: "1111222233334444111122223333444411112222333344441111222233334444",
    },
    {
      level: 2,
      position: "LEFT" as const,
      hash: "5555666677778888555566667777888855556666777788885555666677778888",
    },
  ],
};

describe("MerkleProofAuditTrailVerifier", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <MerkleProofAuditTrailVerifier
        expectedRootHash="root-hash-001"
        blockEpoch={100}
        targetRecord={mockTarget}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders header, canonical root hash, and leaf audit details", () => {
    render(
      <MerkleProofAuditTrailVerifier
        expectedRootHash="root-hash-001"
        blockEpoch={100}
        targetRecord={mockTarget}
      />
    );
    expect(
      screen.getByText("Merkle Proof Audit Trail & Ledger Integrity Verifier")
    ).toBeInTheDocument();
    expect(screen.getByText("root-hash-001")).toBeInTheDocument();
    expect(screen.getByText("TX-JOURNAL-01")).toBeInTheDocument();
    expect(screen.getByText("READY FOR VERIFICATION")).toBeInTheDocument();
  });

  it("computes proof verification and updates status pill", () => {
    const handleVerify = vi.fn();
    render(
      <MerkleProofAuditTrailVerifier
        expectedRootHash="root-hash-001"
        blockEpoch={100}
        targetRecord={mockTarget}
        onVerificationComplete={handleVerify}
      />
    );

    const btn = screen.getByRole("button", {
      name: /verify cryptographic merkle proof/i,
    });
    fireEvent.click(btn);

    expect(handleVerify).toHaveBeenCalledWith(true);
    expect(screen.getByText("CRYPTOGRAPHICALLY VERIFIED")).toBeInTheDocument();
  });
});
