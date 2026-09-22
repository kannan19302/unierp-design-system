import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { NumberInput } from "./number-input";

describe("NumberInput Primitive", () => {
  it("renders with numeric value", () => {
    render(<NumberInput value={120} />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("120");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<NumberInput value={10} aria-label="Units" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
