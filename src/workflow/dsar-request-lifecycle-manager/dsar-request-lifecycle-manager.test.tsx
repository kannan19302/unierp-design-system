import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DsarRequestLifecycleManager } from "./dsar-request-lifecycle-manager";

const mockCase = {
  ticketId: "DSAR-01",
  subjectEmail: "user@domain.com",
  jurisdiction: "GDPR (EU 2016/679)" as const,
  requestType: "RIGHT_TO_ACCESS" as const,
  submittedDate: "2026-08-20",
  daysRemainingSla: 12,
  currentStage: "IDENTITY_VERIFICATION" as const,
  discoveredSystems: [
    {
      systemName: "CRM",
      recordsFound: 10,
      piiCategories: ["Email", "Name"],
      status: "SCANNED" as const,
    },
  ],
};

describe("DsarRequestLifecycleManager", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <DsarRequestLifecycleManager caseDetails={mockCase} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders header, ticket metadata, and discovered systems", () => {
    render(<DsarRequestLifecycleManager caseDetails={mockCase} />);
    expect(
      screen.getByText("GDPR & CCPA Data Subject Access Request (DSAR) Lifecycle")
    ).toBeInTheDocument();
    expect(screen.getByText("DSAR-01")).toBeInTheDocument();
    expect(screen.getByText("user@domain.com")).toBeInTheDocument();
    expect(screen.getByText("CRM")).toBeInTheDocument();
  });

  it("advances to next stage and invokes onAdvanceStage callback", () => {
    const handleAdvance = vi.fn();
    render(
      <DsarRequestLifecycleManager
        caseDetails={mockCase}
        onAdvanceStage={handleAdvance}
      />
    );

    const advanceBtn = screen.getByRole("button", {
      name: /advance dsar to next lifecycle milestone/i,
    });
    fireEvent.click(advanceBtn);

    expect(handleAdvance).toHaveBeenCalledWith("SYSTEM_DATA_DISCOVERY");
  });
});
