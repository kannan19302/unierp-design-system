import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ShareClassCapTableStructure } from "./share-class-cap-table-structure";

const mockShareClasses = [
  {
    id: "sc_1",
    className: "Common Stock",
    authorizedShares: 5000000,
    issuedShares: 4000000,
    fullyDilutedShares: 4000000,
    issuePriceUsd: 0.1,
    liquidationPref: "COMMON_RESIDUAL" as const,
    seniorityRank: 2,
  },
  {
    id: "sc_2",
    className: "Series A Preferred",
    authorizedShares: 2000000,
    issuedShares: 1000000,
    fullyDilutedShares: 1000000,
    issuePriceUsd: 5.0,
    liquidationPref: "1X_NON_PARTICIPATING" as const,
    seniorityRank: 1,
  },
];

describe("ShareClassCapTableStructure", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(
      <ShareClassCapTableStructure
        companyName="Test Corp"
        shareClasses={mockShareClasses}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders company header and KPI values", () => {
    render(
      <ShareClassCapTableStructure
        companyName="Test Corp"
        shareClasses={mockShareClasses}
        postMoneyValuationUsd={50000000}
      />
    );
    expect(
      screen.getByText("Test Corp — Share Class Capital Structure")
    ).toBeInTheDocument();
    expect(screen.getByText("Common Stock")).toBeInTheDocument();
    expect(screen.getByText("Series A Preferred")).toBeInTheDocument();
    expect(screen.getByText("CANONICAL CAP TABLE (LIVE)")).toBeInTheDocument();
  });

  it("toggles simulation mode and calls onModelNewRound callback", () => {
    const handleModel = vi.fn();
    render(
      <ShareClassCapTableStructure
        companyName="Test Corp"
        shareClasses={mockShareClasses}
        onModelNewRound={handleModel}
      />
    );

    const toggleBtn = screen.getByRole("button", { name: /model new financing round/i });
    fireEvent.click(toggleBtn);

    expect(handleModel).toHaveBeenCalledTimes(1);
    expect(screen.getByText("PRO-FORMA ROUND SIMULATION")).toBeInTheDocument();
    expect(screen.getByText("Exit Model Mode")).toBeInTheDocument();
  });
});
