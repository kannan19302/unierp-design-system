import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { PriorityIndicator } from "./priority-indicator";

describe("PriorityIndicator Primitive", () => {
  it("renders priority text and aria-label", () => {
    render(<PriorityIndicator priority="urgent" />);
    expect(screen.getByLabelText("Priority: Urgent")).toBeInTheDocument();
    expect(screen.getByText("Urgent")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<PriorityIndicator priority="high" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
