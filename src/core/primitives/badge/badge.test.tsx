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

  it("supports secondary, destructive, and outline variants", () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary").parentElement?.className).toContain("secondary");

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText("Destructive").parentElement?.className).toContain("destructive");

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline").parentElement?.className).toContain("outline");
  });

  it("has zero accessibility violations across variants", async () => {
    const { container } = render(
      <div>
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <StatusBadge status="ACTIVE" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

