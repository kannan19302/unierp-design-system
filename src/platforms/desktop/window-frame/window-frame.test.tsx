import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { WindowFrame } from "./window-frame";

describe("WindowFrame Component", () => {
  it("renders desktop application window landmark", () => {
    render(
      <WindowFrame
        titlebar={<div>Custom Titlebar</div>}
        sidebar={<div>Sidebar Pane</div>}
      >
        <div>Content Area</div>
      </WindowFrame>
    );
    expect(screen.getByRole("region", { name: /desktop application window/i })).toBeInTheDocument();
    expect(screen.getByText("Custom Titlebar")).toBeInTheDocument();
    expect(screen.getByText("Sidebar Pane")).toBeInTheDocument();
    expect(screen.getByText("Content Area")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <WindowFrame>
        <div>Accessible Content</div>
      </WindowFrame>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
