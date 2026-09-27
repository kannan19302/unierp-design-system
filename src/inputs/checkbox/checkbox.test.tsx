import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "./checkbox";

describe("Strata V1 Checkbox Primitive", () => {
  it("toggles checked state in uncontrolled mode", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Subscribe" defaultChecked={false} onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("handles controlled checked state", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Checkbox label="Controlled" checked={false} onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(<Checkbox label="Controlled" checked={true} onChange={onChange} />);
    expect(checkbox).toBeChecked();
  });

  it("renders indeterminate state with minus icon", () => {
    render(<Checkbox label="Indeterminate" indeterminate />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("prevents toggle when disabled", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Disabled" disabled onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders with aria-invalid when invalid", () => {
    render(<Checkbox label="Required Terms" invalid />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("has zero accessibility violations across checked, indeterminate and disabled states", async () => {
    const { container, rerender } = render(<Checkbox label="Terms and Conditions" />);
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Checkbox label="Terms and Conditions" checked />);
    results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Checkbox label="Terms and Conditions" indeterminate />);
    results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Checkbox label="Terms and Conditions" disabled />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
