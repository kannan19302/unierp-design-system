import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Slider } from "./slider";

describe("Strata V1 Slider Primitive", () => {
  it("renders with initial value and calls onChange on change", () => {
    const onChange = vi.fn();
    render(<Slider value={50} onChange={onChange} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveValue("50");

    fireEvent.change(slider, { target: { value: "75" } });
    expect(onChange).toHaveBeenCalledWith(75);
  });

  it("renders formatted value display when showValue is true", () => {
    render(
      <Slider
        value={40}
        showValue
        valueFormatter={(v) => `${v}%`}
        aria-label="Progress"
      />
    );
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("respects min, max, and step attributes", () => {
    render(<Slider min={10} max={90} step={5} value={25} aria-label="Threshold" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "10");
    expect(slider).toHaveAttribute("max", "90");
    expect(slider).toHaveAttribute("step", "5");
  });

  it("disables interaction when disabled is true", () => {
    render(<Slider disabled value={30} aria-label="Disabled" />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("has zero accessibility violations across states", async () => {
    const { container, rerender } = render(<Slider value={50} aria-label="Contrast slider" />);
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Slider showValue value={80} aria-label="Contrast slider" />);
    results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Slider disabled value={20} aria-label="Contrast slider" />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
