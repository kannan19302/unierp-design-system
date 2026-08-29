import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { NumberStepper } from "./number-stepper";

describe("NumberStepper Component", () => {
  it("renders with default value and increments/decrements", () => {
    const onChange = vi.fn();
    render(<NumberStepper defaultValue={5} step={1} onChange={onChange} />);

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(5);

    fireEvent.click(screen.getByRole("button", { name: /increase value/i }));
    expect(onChange).toHaveBeenCalledWith(6);

    fireEvent.click(screen.getByRole("button", { name: /decrease value/i }));
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("respects min and max bounds", () => {
    render(<NumberStepper defaultValue={10} min={10} max={12} />);

    const decBtn = screen.getByRole("button", { name: /decrease value/i });
    const incBtn = screen.getByRole("button", { name: /increase value/i });

    expect(decBtn).toBeDisabled();
    expect(incBtn).not.toBeDisabled();

    fireEvent.click(incBtn); // 11
    expect(decBtn).not.toBeDisabled();
    expect(incBtn).not.toBeDisabled();

    fireEvent.click(incBtn); // 12
    expect(incBtn).toBeDisabled();
  });

  it("handles ArrowUp and ArrowDown keyboard inputs", () => {
    const onChange = vi.fn();
    render(<NumberStepper defaultValue={20} onChange={onChange} />);

    const input = screen.getByRole("spinbutton");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledWith(21);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledWith(20);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<NumberStepper label="Order Quantity" defaultValue={1} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
