import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ThemeQuickToggle } from "./theme-quick-toggle";
import { ThemeProvider } from "../theme-provider/theme-provider";

describe("ThemeQuickToggle Primitive", () => {
  it("renders light/dark toggle and responds to click", () => {
    render(
      <ThemeProvider defaultTheme="meridian">
        <ThemeQuickToggle />
      </ThemeProvider>
    );

    const toggle = screen.getByRole("button");
    expect(toggle).toBeInTheDocument();
    fireEvent.click(toggle);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ThemeProvider defaultTheme="meridian">
        <ThemeQuickToggle />
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
