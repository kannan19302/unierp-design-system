import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup } from "./radio-group";

const OPTIONS = [
  { value: "a", label: "Option A", hint: "Hint A" },
  { value: "b", label: "Option B", hint: "Hint B" },
  { value: "c", label: "Option C", disabled: true },
];

describe("Strata V1 RadioGroup Primitive", () => {
  it("renders options with labels and hints", () => {
    render(<RadioGroup options={OPTIONS} value="a" />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Hint A")).toBeInTheDocument();
  });

  it("selects an option on change", () => {
    const onChange = vi.fn();
    render(<RadioGroup options={OPTIONS} value="a" onChange={onChange} />);
    const radioB = screen.getByRole("radio", { name: /Option B/i });
    fireEvent.click(radioB);
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("does not select disabled option", () => {
    const onChange = vi.fn();
    render(<RadioGroup options={OPTIONS} value="a" onChange={onChange} />);
    const radioC = screen.getByRole("radio", { name: /Option C/i });
    fireEvent.click(radioC);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables all options when disabled is true", () => {
    const onChange = vi.fn();
    render(<RadioGroup disabled options={OPTIONS} value="a" onChange={onChange} />);
    const radioB = screen.getByRole("radio", { name: /Option B/i });
    fireEvent.click(radioB);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has zero accessibility violations across orientations", async () => {
    const { container, rerender } = render(<RadioGroup options={OPTIONS} value="a" />);
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<RadioGroup orientation="horizontal" options={OPTIONS} value="b" />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
