import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ThemeProvider, useTheme } from "./theme-provider";

const Consumer = () => {
  const { setting, resolvedTheme, setTheme, density, setDensity } = useTheme();
  return (
    <div>
      <span data-testid="theme-name">{resolvedTheme || setting}</span>
      <span data-testid="density-name">{density}</span>
      <button onClick={() => setTheme("meridian-dark")}>Set Dark</button>
      <button onClick={() => setDensity("compact")}>Set Compact</button>
    </div>
  );
};

describe("ThemeProvider Primitive", () => {
  it("provides active theme context and allows updates", () => {
    render(
      <ThemeProvider defaultSetting="meridian" defaultDensity="standard">
        <Consumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme-name")).toHaveTextContent("meridian");
    expect(screen.getByTestId("density-name")).toHaveTextContent("standard");

    fireEvent.click(screen.getByText("Set Dark"));
    expect(screen.getByTestId("theme-name")).toHaveTextContent("meridian-dark");

    fireEvent.click(screen.getByText("Set Compact"));
    expect(screen.getByTestId("density-name")).toHaveTextContent("compact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ThemeProvider>
        <div>Accessible Context App</div>
      </ThemeProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
