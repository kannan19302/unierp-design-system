import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { NumberInput } from "./number-input";

describe("Strata V1 NumberInput Primitive", () => {
  it("renders with initial value and fires onChange", () => {
    const onChange = vi.fn();
    render(<NumberInput value={10} onChange={onChange} aria-label="Units" />);
    const input = screen.getByRole("spinbutton");
    expect(input).toHaveValue(10);

    fireEvent.change(input, { target: { value: "25" } });
    expect(onChange).toHaveBeenCalledWith(25);
  });

  it("clamps to min/max on blur", () => {
    const onChange = vi.fn();
    render(<NumberInput min={5} max={50} value={10} onChange={onChange} aria-label="Units" />);
    const input = screen.getByRole("spinbutton");

    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(50);
    expect(onChange).toHaveBeenCalledWith(50);

    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.blur(input);
    expect(input).toHaveValue(5);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("renders slots correctly", () => {
    render(
      <NumberInput
        value={15}
        prefix={<span data-testid="prefix">#</span>}
        suffix={<span data-testid="suffix">units</span>}
        aria-label="Stock"
      />
    );
    expect(screen.getByTestId("prefix")).toBeInTheDocument();
    expect(screen.getByTestId("suffix")).toBeInTheDocument();
  });

  it("renders invalid state with aria-invalid", () => {
    render(<NumberInput invalid value={-5} aria-label="Negative stock" />);
    expect(screen.getByRole("spinbutton")).toHaveAttribute("aria-invalid", "true");
  });

  it("has zero accessibility violations across states", async () => {
    const { container, rerender } = render(<NumberInput value={100} aria-label="Quantity" />);
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(
      <NumberInput
        value={50}
        prefix={<span>#</span>}
        suffix={<span>units</span>}
        aria-label="Quantity"
      />
    );
    results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<NumberInput disabled value={0} aria-label="Quantity" />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
