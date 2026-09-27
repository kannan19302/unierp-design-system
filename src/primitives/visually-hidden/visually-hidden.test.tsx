import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { VisuallyHidden } from "./visually-hidden";

describe("VisuallyHidden", () => {
  it("renders screen-reader text in DOM with data-slot", () => {
    const { container } = render(<VisuallyHidden>Assistive label</VisuallyHidden>);
    expect(screen.getByText("Assistive label")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="visually-hidden"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<VisuallyHidden>Screen reader content</VisuallyHidden>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
