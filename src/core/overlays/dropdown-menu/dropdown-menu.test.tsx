import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DropdownMenu } from "./dropdown-menu";

describe("DropdownMenu Primitive", () => {
  it("opens menu and handles item click", () => {
    const onAction = vi.fn();
    render(
      <DropdownMenu
        trigger={<button>Options</button>}
        items={[{ key: "1", label: "Approve", onClick: onAction }]}
      />
    );
    fireEvent.click(screen.getByText("Options"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Approve"));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <DropdownMenu
        trigger={<button>Menu</button>}
        items={[{ key: "1", label: "Item 1" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
