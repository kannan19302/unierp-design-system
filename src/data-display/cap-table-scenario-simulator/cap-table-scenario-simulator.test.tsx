import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { CapTableScenarioSimulator } from "./cap-table-scenario-simulator";

describe("CapTableScenarioSimulator", () => {
  it("renders round parameters and has zero accessibility violations", async () => {
    const { container } = render(
      <CapTableScenarioSimulator
        roundName="Series A Test"
        initialPreMoney={20000000}
        initialInvestment={5000000}
      />
    );

    expect(screen.getByText("Series A Test")).toBeInTheDocument();
    expect(screen.getAllByText("$25,000,000").length).toBeGreaterThan(0); // Post money = $25M
    expect(screen.getByText("Series A Lead Investor (New)")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("updates post-money and dilution when pre-money slider changes", () => {
    render(
      <CapTableScenarioSimulator
        initialPreMoney={20000000}
        initialInvestment={5000000}
      />
    );

    const preMoneySlider = screen.getByLabelText(/Pre-Money Valuation:/i);
    fireEvent.change(preMoneySlider, { target: { value: "30000000" } });

    expect(screen.getAllByText("$35,000,000").length).toBeGreaterThan(0); // 30M + 5M = 35M
  });

  it("switches pool timing between pre-money and post-money", () => {
    render(
      <CapTableScenarioSimulator
        initialPreMoney={20000000}
        initialInvestment={5000000}
      />
    );

    const postMoneyBtn = screen.getByRole("button", { name: /Post-Money Pool/i });
    fireEvent.click(postMoneyBtn);

    expect(postMoneyBtn.className).toMatch(/timingBtnActive/);
  });
});
