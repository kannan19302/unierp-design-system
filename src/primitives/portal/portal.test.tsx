import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Portal, portalVariants } from "./portal";

describe("Portal Primitive", () => {
  it("renders children into document body with data-slot attribute", () => {
    render(
      <Portal>
        <div data-testid="portaled-content">Portaled Content</div>
      </Portal>
    );
    expect(screen.getByTestId("portaled-content")).toBeInTheDocument();
    expect(document.body).toContainElement(screen.getByTestId("portaled-content"));
    expect(document.querySelector("[data-slot='portal']")).toBeInTheDocument();
  });

  it("generates correct classes via portalVariants cva helper", () => {
    const classes = portalVariants({ className: "custom-portal" });
    expect(classes).toContain("custom-portal");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Portal>
        <div>Accessible Portaled Content</div>
      </Portal>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
