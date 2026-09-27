import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Badge, badgeVariants } from "./badge";
import { StatusBadge } from "./status-badge";

describe("Badge Primitive", () => {
  it("renders text content correctly", () => {
    render(<Badge variant="success">Completed</Badge>);
    const badge = screen.getByText("Completed").closest("[data-slot='badge']");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("data-variant", "success");
  });

  it("maps status strings correctly in StatusBadge", () => {
    render(<StatusBadge status="PARTIALLY_PAID" />);
    expect(screen.getByText("PARTIALLY PAID")).toBeInTheDocument();
  });

  it("supports secondary, destructive, and outline variants", () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary").closest("[data-slot='badge']")?.className).toContain(
      "secondary"
    );

    rerender(<Badge variant="destructive">Destructive</Badge>);
    expect(screen.getByText("Destructive").closest("[data-slot='badge']")?.className).toContain(
      "destructive"
    );

    rerender(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText("Outline").closest("[data-slot='badge']")?.className).toContain(
      "outline"
    );
  });

  it("generates correct class names via badgeVariants cva helper", () => {
    const classes = badgeVariants({ variant: "destructive", size: "md" });
    expect(classes).toContain("destructive");
    expect(classes).toContain("md");
  });

  it("renders dot with data-slot when dot prop is passed", () => {
    render(
      <Badge variant="success" dot pulse>
        Live
      </Badge>
    );
    const dot = document.querySelector("[data-slot='dot']");
    expect(dot).toBeInTheDocument();
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
