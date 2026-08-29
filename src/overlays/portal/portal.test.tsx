import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Portal } from "./portal";

describe("Portal Primitive", () => {
  it("renders children into document body", () => {
    render(
      <Portal>
        <div data-testid="portaled-content">Portaled Content</div>
      </Portal>
    );
    expect(screen.getByTestId("portaled-content")).toBeInTheDocument();
    expect(document.body).toContainElement(screen.getByTestId("portaled-content"));
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
