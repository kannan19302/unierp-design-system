import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { PortfolioRiskStressTester } from "./portfolio-risk-stress-tester";

describe("PortfolioRiskStressTester", () => {
  it("renders with zero axe accessibility violations", async () => {
    const { container } = render(<PortfolioRiskStressTester />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders portfolio heading and asset classes", () => {
    render(<PortfolioRiskStressTester portfolioName="Institutional Sovereign Fund" />);
    expect(screen.getByText("Institutional Sovereign Fund")).toBeInTheDocument();
    expect(screen.getByText(/Portfolio Value-at-Risk/i)).toBeInTheDocument();
    expect(screen.getByText("Global Equities (Developed)")).toBeInTheDocument();
    expect(screen.getByText("US Sovereign Treasuries")).toBeInTheDocument();
  });

  it("handles macro scenario selection switch", () => {
    const onSelect = vi.fn();
    render(<PortfolioRiskStressTester onSelectScenario={onSelect} />);

    const select = screen.getByLabelText("Macro Scenario:");
    fireEvent.change(select, { target: { value: "rate_shock_300" } });

    expect(onSelect).toHaveBeenCalledWith("rate_shock_300");
    expect(
      screen.getByText(/Aggressive monetary tightening with parallel 300bps/i)
    ).toBeInTheDocument();
  });
});
