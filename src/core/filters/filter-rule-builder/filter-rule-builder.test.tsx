import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FilterRuleBuilder } from "./filter-rule-builder";

describe("FilterRuleBuilder Component", () => {
  it("renders with default rules", () => {
    render(<FilterRuleBuilder />);
    expect(screen.getByRole("region", { name: /filter rule builder/i })).toBeInTheDocument();
    expect(screen.getByTestId("filter-rule-0")).toBeInTheDocument();
  });

  it("adds a new rule on button click", () => {
    const onRulesChange = vi.fn();
    render(<FilterRuleBuilder onRulesChange={onRulesChange} />);
    const addBtn = screen.getByRole("button", { name: /\+ add filter condition/i });
    fireEvent.click(addBtn);
    expect(screen.getByTestId("filter-rule-1")).toBeInTheDocument();
    expect(onRulesChange).toHaveBeenCalled();
  });

  it("removes a rule when remove button clicked", () => {
    const onRulesChange = vi.fn();
    render(<FilterRuleBuilder onRulesChange={onRulesChange} />);
    const removeBtn = screen.getByRole("button", { name: /remove rule 1/i });
    fireEvent.click(removeBtn);
    expect(screen.queryByTestId("filter-rule-0")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FilterRuleBuilder />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
