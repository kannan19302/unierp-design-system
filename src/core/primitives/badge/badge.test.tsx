import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Badge } from "./badge";
import { StatusBadge } from "./status-badge";

describe("Badge Primitive", () => {
  it("renders text content correctly", () => {
    render(<Badge variant="success">Completed</Badge>);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("maps status strings correctly in StatusBadge", () => {
    render(<StatusBadge status="PARTIALLY_PAID" />);
    expect(screen.getByText("PARTIALLY PAID")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Badge variant="primary" dot>Live</Badge>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
