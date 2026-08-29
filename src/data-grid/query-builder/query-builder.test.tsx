import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { QueryBuilder, type QueryField } from "../query-builder";

const mockFields: QueryField[] = [
  { name: "status", label: "Status", type: "string" },
  { name: "amount", label: "Amount", type: "number" },
];

describe("QueryBuilder Primitive", () => {
  it("renders rule fields and allows adding rules", () => {
    const onChange = vi.fn();
    render(<QueryBuilder fields={mockFields} onChange={onChange} />);

    expect(screen.getByText("Advanced Filter Rules")).toBeInTheDocument();
    expect(screen.getByText("MATCH ALL (AND)")).toBeInTheDocument();

    const addRuleBtn = screen.getByLabelText("Add condition rule");
    fireEvent.click(addRuleBtn);

    expect(onChange).toHaveBeenCalled();
  });

  it("switches combinator between AND and OR", () => {
    const onChange = vi.fn();
    render(<QueryBuilder fields={mockFields} onChange={onChange} />);

    const combinatorSelect = screen.getByLabelText("Condition combinator");
    fireEvent.change(combinatorSelect, { target: { value: "OR" } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ combinator: "OR" })
    );
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<QueryBuilder fields={mockFields} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
