import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Slider } from "./slider";

describe("Slider Primitive", () => {
  it("handles slider value change", () => {
    const onChange = vi.fn();
    render(<Slider value={20} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "45" } });
    expect(onChange).toHaveBeenCalledWith(45);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Slider value={30} aria-label="Threshold" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
