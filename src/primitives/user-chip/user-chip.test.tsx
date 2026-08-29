import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { UserChip } from "./user-chip";

describe("UserChip Primitive", () => {
  it("renders name and role correctly", () => {
    render(<UserChip name="Marcus Vance" role="Senior Accountant" status="online" />);
    expect(screen.getByText("Marcus Vance")).toBeInTheDocument();
    expect(screen.getByText("Senior Accountant")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<UserChip name="Sarah Connor" role="Admin" status="away" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
