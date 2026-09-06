import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ContractClauseRiskAnalyzer } from "./contract-clause-risk-analyzer";

describe("ContractClauseRiskAnalyzer", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<ContractClauseRiskAnalyzer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders contract details and clause deviations", () => {
    render(
      <ContractClauseRiskAnalyzer
        contractTitle="Global Distribution Agreement"
        counterparty="Apex Logistics Corp"
      />
    );
    expect(screen.getByText("Global Distribution Agreement")).toBeInTheDocument();
    expect(screen.getByText("Counterparty: Apex Logistics Corp")).toBeInTheDocument();
    expect(screen.getByText("Limitation of Liability & Consequential Damages")).toBeInTheDocument();
    expect(screen.getByText(/Uncapped liability violates corporate standard playbook/i)).toBeInTheDocument();
  });

  it("handles accepting deviation and reverting to playbook standard", () => {
    const onAccept = vi.fn();
    const onRevert = vi.fn();
    render(
      <ContractClauseRiskAnalyzer
        onAcceptDeviation={onAccept}
        onRevertToStandard={onRevert}
      />
    );

    const acceptButtons = screen.getAllByRole("button", { name: /Accept redline deviation/i });
    fireEvent.click(acceptButtons[0]);
    expect(onAccept).toHaveBeenCalledWith("cls_lol_01");
    expect(screen.getByText("Deviation Accepted by Legal Counsel")).toBeInTheDocument();

    const revertButtons = screen.getAllByRole("button", { name: /Revert to playbook standard/i });
    fireEvent.click(revertButtons[0]);
    expect(onRevert).toHaveBeenCalledWith("cls_indem_02");
    expect(screen.getByText("Reverted to Approved Corporate Standard")).toBeInTheDocument();
  });
});
