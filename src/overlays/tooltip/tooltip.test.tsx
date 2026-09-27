import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Tooltip } from "./tooltip";

describe("Tooltip Primitive", () => {
  it("displays tooltip content on hover", () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText("Hover me"));
    expect(screen.getByRole("tooltip")).toHaveTextContent("Tooltip text");
  });

  it("renders data-slot anatomy correctly", () => {
    render(
      <Tooltip content="Helper info" side="bottom" density="compact">
        <button>Inspect</button>
      </Tooltip>
    );
    expect(document.querySelector('[data-slot="tooltip-trigger"]')).toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByText("Inspect"));
    const tooltip = document.querySelector('[data-slot="tooltip"]');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute("data-side", "bottom");
    expect(tooltip).toHaveAttribute("data-density", "compact");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Tooltip content="Help text">
        <button>Help</button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
