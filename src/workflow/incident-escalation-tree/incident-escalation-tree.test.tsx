import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { IncidentEscalationTree, type EscalationTier } from "./incident-escalation-tree";

const testTiers: EscalationTier[] = [
  {
    id: "tier-1",
    tierNumber: 1,
    name: "Primary SRE On-Call",
    timeoutMinutes: 10,
    status: "paging",
    responders: [
      {
        id: "resp-1",
        name: "Devon Vance",
        role: "Principal SRE",
        status: "on_call",
        channels: ["push", "sms", "phone"],
      },
      {
        id: "resp-2",
        name: "Elena Rostova",
        role: "Senior Systems Engineer",
        status: "backup",
        channels: ["push", "email"],
      },
    ],
  },
  {
    id: "tier-2",
    tierNumber: 2,
    name: "Secondary Infrastructure Escalation",
    timeoutMinutes: 15,
    status: "waiting",
    responders: [
      {
        id: "resp-3",
        name: "Marcus Aurel",
        role: "Staff Infrastructure Architect",
        status: "backup",
        channels: ["phone", "webhook"],
      },
    ],
  },
];

describe("IncidentEscalationTree", () => {
  it("renders escalation tiers and responders correctly", () => {
    render(
      <IncidentEscalationTree
        title="Production Incident Ladder"
        tiers={testTiers}
        policyStatus="active"
      />
    );

    expect(screen.getByText("Production Incident Ladder")).toBeInTheDocument();
    expect(screen.getByText("Primary SRE On-Call")).toBeInTheDocument();
    expect(screen.getByText("Secondary Infrastructure Escalation")).toBeInTheDocument();
    expect(screen.getByText("Devon Vance")).toBeInTheDocument();
    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
  });

  it("handles tier acknowledgement and escalation callbacks", () => {
    const onAcknowledge = vi.fn();
    const onEscalate = vi.fn();

    render(
      <IncidentEscalationTree
        title="Production Incident Ladder"
        tiers={testTiers}
        policyStatus="active"
        onAcknowledgeTier={onAcknowledge}
        onEscalateNow={onEscalate}
      />
    );

    const ackBtn = screen.getByRole("button", { name: /Acknowledge Tier/i });
    fireEvent.click(ackBtn);
    expect(onAcknowledge).toHaveBeenCalledWith("tier-1");

    const escBtn = screen.getByRole("button", { name: /Escalate Next/i });
    fireEvent.click(escBtn);
    expect(onEscalate).toHaveBeenCalledWith("tier-1");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <IncidentEscalationTree
        title="Production Incident Ladder"
        tiers={testTiers}
        policyStatus="active"
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
