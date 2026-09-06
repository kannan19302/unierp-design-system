import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BankRuleConditionBuilder } from "./bank-rule-condition-builder";

describe("BankRuleConditionBuilder", () => {
  it("renders rule configuration fields and condition rows", () => {
    render(<BankRuleConditionBuilder />);

    expect(screen.getByText("Bank Statement Automation Rule Builder")).toBeInTheDocument();
    expect(screen.getByLabelText(/Rule Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Apply to Bank Account:/i)).toBeInTheDocument();
    expect(screen.getByText(/When a statement line matches:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Save & Activate Rule/i })).toBeInTheDocument();
  });

  it("handles condition addition and simulation testing", () => {
    render(<BankRuleConditionBuilder />);

    const addBtn = screen.getByRole("button", { name: /\+ Add Another Condition/i });
    fireEvent.click(addBtn);

    expect(screen.getByText("#3")).toBeInTheDocument();

    const simBtn = screen.getByRole("button", { name: /Simulate Match/i });
    fireEvent.click(simBtn);

    expect(screen.getByText(/RULE MATCH SUCCESSFUL/i)).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<BankRuleConditionBuilder />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
