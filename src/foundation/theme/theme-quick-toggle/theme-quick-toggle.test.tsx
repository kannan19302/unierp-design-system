import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ThemeQuickToggle } from "./theme-quick-toggle";
import { ThemeProvider } from "../theme-provider/theme-provider";

describe("ThemeQuickToggle Primitive", () => {
  it("renders light/dark toggle and responds to click with data slots", () => {
    render(
      <ThemeProvider defaultTheme="strata">
        <ThemeQuickToggle />
      </ThemeProvider>
    );

    const toggle = screen.getByRole("button");
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("data-slot", "theme-quick-toggle");
    expect(toggle).toHaveAttribute("data-density", "standard");
    fireEvent.click(toggle);
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <ThemeQuickToggle density="ultra-compact" />
    );
    let toggle = container.querySelector('[data-slot="theme-quick-toggle"]');
    expect(toggle).toHaveAttribute("data-density", "ultra-compact");
    expect(toggle?.className).toContain("densityUltraCompact");

    rerender(<ThemeQuickToggle density="comfortable" />);
    toggle = container.querySelector('[data-slot="theme-quick-toggle"]');
    expect(toggle).toHaveAttribute("data-density", "comfortable");
    expect(toggle?.className).toContain("densityComfortable");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ThemeProvider defaultTheme="strata">
        <ThemeQuickToggle />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
