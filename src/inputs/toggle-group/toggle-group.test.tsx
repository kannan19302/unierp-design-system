import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup Primitive", () => {
  it("handles single selection accurately", () => {
    const handleChange = vi.fn();
    render(
      <ToggleGroup type="single" defaultValue="a" onValueChange={handleChange} aria-label="Option selection">
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
      <ToggleGroup type="multiple" defaultValue={["bold"]} onValueChange={handleChange} aria-label="Text formatting">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    );

    const btnItalic = screen.getByRole("checkbox", { name: "Italic" });
    fireEvent.click(btnItalic);
    expect(handleChange).toHaveBeenCalledWith(["bold", "italic"]);
  });

  it("has zero accessibility violations in single and multiple modes", async () => {
    const { container, rerender } = render(
      <ToggleGroup type="single" defaultValue="left" aria-label="Text alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    );
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(
      <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text style">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
