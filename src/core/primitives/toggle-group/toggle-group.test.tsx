import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup Primitive", () => {
  it("handles single selection accurately", () => {
    const handleChange = vi.fn();
    render(
      <ToggleGroup type="single" defaultValue="a" onValueChange={handleChange}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    );

    const btnA = screen.getByRole("radio", { name: "A" });
    const btnB = screen.getByRole("radio", { name: "B" });

    expect(btnA).toHaveAttribute("aria-checked", "true");
    expect(btnB).toHaveAttribute("aria-checked", "false");

    fireEvent.click(btnB);
    expect(handleChange).toHaveBeenCalledWith("b");
    expect(btnB).toHaveAttribute("aria-checked", "true");
    expect(btnA).toHaveAttribute("aria-checked", "false");
  });

  it("handles multiple selection toggle", () => {
    const handleChange = vi.fn();
    render(
      <ToggleGroup type="multiple" defaultValue={["bold"]} onValueChange={handleChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    );

    const btnItalic = screen.getByRole("radio", { name: "Italic" });
    fireEvent.click(btnItalic);
    expect(handleChange).toHaveBeenCalledWith(["bold", "italic"]);
  });
});
