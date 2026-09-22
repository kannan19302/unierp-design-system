import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PercentInput } from "./percent-input";

describe("PercentInput Primitive", () => {
  it("renders percent symbol", () => {
    render(<PercentInput value={25} />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("clamps values within min and max on blur", () => {
    const onChange = vi.fn();
    render(<PercentInput min={0} max={100} value={150} onChange={onChange} />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.blur(input);
    expect(input.value).toBe("100");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<PercentInput value={50} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
