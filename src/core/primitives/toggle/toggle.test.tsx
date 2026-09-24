import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Toggle } from "./toggle";

describe("Toggle Primitive", () => {
  it("renders with default unpressed state and updates on click", () => {
    const handlePressedChange = vi.fn();
    render(<Toggle onPressedChange={handlePressedChange}>Bold</Toggle>);
    const button = screen.getByRole("button", { name: "Bold" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(handlePressedChange).toHaveBeenCalledWith(true);

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(handlePressedChange).toHaveBeenCalledWith(false);
  });

  it("respects controlled pressed prop", () => {
    const { rerender } = render(<Toggle pressed={false}>Italic</Toggle>);
    const button = screen.getByRole("button", { name: "Italic" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    rerender(<Toggle pressed={true}>Italic</Toggle>);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("does not fire when disabled", () => {
    const handlePressedChange = vi.fn();
    render(
      <Toggle disabled onPressedChange={handlePressedChange}>
        Underline
      </Toggle>
    );
    const button = screen.getByRole("button", { name: "Underline" });
    fireEvent.click(button);
    expect(handlePressedChange).not.toHaveBeenCalled();
  });

  it("has zero accessibility violations across variants and states", async () => {
    const { container } = render(
      <div>
        <Toggle variant="default" aria-label="Toggle pin">Pin</Toggle>
        <Toggle variant="outline" pressed aria-label="Toggle mute">Mute</Toggle>
        <Toggle disabled aria-label="Toggle locked">Locked</Toggle>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
