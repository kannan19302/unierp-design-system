import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FilterRuleBuilder, filterRuleBuilderVariants } from "./filter-rule-builder";

describe("FilterRuleBuilder Component", () => {
  it("renders with default rules", () => {
    render(<FilterRuleBuilder />);
    expect(screen.getByRole("region", { name: /filter rule builder/i })).toBeInTheDocument();
    expect(screen.getByTestId("filter-rule-0")).toBeInTheDocument();
  });

  it("adds a new rule on button click", () => {
    const onRulesChange = vi.fn();
    render(<FilterRuleBuilder onRulesChange={onRulesChange} />);
    const addBtn = screen.getByRole("button", { name: /add filter condition/i });
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

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<FilterRuleBuilder density="compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<FilterRuleBuilder density="ultra-compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<FilterRuleBuilder density="comfortable" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FilterRuleBuilder />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("supports filterRuleBuilderVariants cva and exposes data-slot annotations", () => {
    expect(typeof filterRuleBuilderVariants).toBe("function");
    expect(filterRuleBuilderVariants({ density: "compact" })).toBeDefined();

    const { container } = render(<FilterRuleBuilder density="compact" />);

    expect(container.querySelector('[data-slot="filter-rule-builder"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-header"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-count"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-list"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-row"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-combinator"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-field"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-operator"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-value"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-remove"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="filter-rule-builder-add"]')).toBeInTheDocument();
  });
});

