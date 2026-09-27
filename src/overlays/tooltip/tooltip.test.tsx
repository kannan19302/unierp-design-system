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
