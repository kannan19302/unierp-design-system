import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "./checkbox";

describe("Checkbox Primitive", () => {
  it("toggles checked state", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Include archived" onChange={onChange} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.checked).toBe(false);
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Checkbox label="Verify audit trail" defaultChecked />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
