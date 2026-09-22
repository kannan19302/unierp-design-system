import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Popover } from "./popover";

describe("Popover Primitive", () => {
  it("opens popover content on trigger click", () => {
    render(
      <Popover trigger={<button>Open Popover</button>}>
        <div>Popover details</div>
      </Popover>
    );
    expect(screen.queryByText("Popover details")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Open Popover"));
    expect(screen.getByText("Popover details")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <Popover trigger={<button>Accessible Trigger</button>}>
        <div>Content</div>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
