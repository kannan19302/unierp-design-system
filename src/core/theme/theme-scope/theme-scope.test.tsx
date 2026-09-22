import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeScope } from "../theme-scope";

describe("ThemeScope", () => {
  it("renders with dataset attributes for theme, density, and platform", () => {
    render(
      <ThemeScope theme="meridian-dark" density="compact" platform="developer">
        <span data-testid="child">Scoped Content</span>
      </ThemeScope>,
    );

    const child = screen.getByTestId("child");
    const container = child.parentElement;
    expect(container).toHaveAttribute("data-theme", "meridian-dark");
    expect(container).toHaveAttribute("data-density", "compact");
    expect(container).toHaveAttribute("data-platform", "developer");
  });

  it("supports custom semantic HTML wrapper element", () => {
    render(
      <ThemeScope as="section" density="comfortable" data-testid="section-scope">
        <span>Section Content</span>
      </ThemeScope>,
    );

    const section = screen.getByTestId("section-scope");
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("data-density", "comfortable");
  });
});
