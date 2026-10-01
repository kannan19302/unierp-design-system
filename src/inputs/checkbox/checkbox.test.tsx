import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
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

  it("synchronizes the native indeterminate property with the prop", () => {
    const { rerender } = render(<Checkbox label="Indeterminate" indeterminate />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveProperty("indeterminate", true);

    rerender(<Checkbox label="Indeterminate" indeterminate={false} />);
    expect(checkbox).toHaveProperty("indeterminate", false);

    rerender(<Checkbox label="Indeterminate" indeterminate />);
    expect(checkbox).toHaveProperty("indeterminate", true);
  });

  it("preserves mixed semantics when the native checkbox is activated", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Checkbox label="Partially selected" indeterminate onChange={onChange} />
    );
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveProperty("indeterminate", true);
    expect(container.querySelector('[data-slot="checkbox"]')).toHaveAttribute(
      "data-state",
      "indeterminate"
    );
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("forwards the native input ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Forwarded ref" indeterminate />);

    expect(ref.current).toBe(screen.getByRole("checkbox"));
    expect(ref.current).toHaveProperty("indeterminate", true);
  });

  it("preserves React 19 callback-ref cleanup", () => {
    const cleanup = vi.fn();
    const ref = vi.fn((node: HTMLInputElement | null) => (node ? cleanup : undefined));
    const { unmount } = render(<Checkbox ref={ref} label="Callback ref" />);

    expect(ref).toHaveBeenCalledWith(screen.getByRole("checkbox"));
    unmount();
    expect(cleanup).toHaveBeenCalledOnce();
  });

  it("prevents toggle when disabled", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Disabled" disabled onChange={onChange} />);
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders with aria-invalid when invalid and exposes data-slot", () => {
    const { container } = render(<Checkbox label="Required Terms" invalid density="compact" indeterminate />);
    const root = container.querySelector('[data-slot="checkbox"]');
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-state", "indeterminate");
    expect(root).toHaveAttribute("data-density", "compact");
    expect(root).toHaveAttribute("data-invalid", "true");
    expect(container.querySelector('[data-slot="checkbox-indicator"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="checkbox-label"]')).toBeInTheDocument();
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
