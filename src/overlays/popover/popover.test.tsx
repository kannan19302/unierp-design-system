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

  it("renders data-slot anatomy correctly", () => {
    render(
      <Popover
        density="compact"
        size="lg"
        trigger={<button>Trigger</button>}
      >
        <div>Content</div>
      </Popover>
    );
    expect(document.querySelector('[data-slot="popover-container"]')).toBeInTheDocument();
    expect(document.querySelector('[data-slot="popover-trigger"]')).toBeInTheDocument();

    fireEvent.click(screen.getByText("Trigger"));
    const pop = document.querySelector('[data-slot="popover"]');
    expect(pop).toBeInTheDocument();
    expect(pop).toHaveAttribute("data-density", "compact");
    expect(pop).toHaveAttribute("data-size", "lg");
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
