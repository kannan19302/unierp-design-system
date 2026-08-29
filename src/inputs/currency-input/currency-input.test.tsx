import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CurrencyInput } from "./currency-input";

describe("CurrencyInput Primitive", () => {
  it("formats decimal value on blur", () => {
    const onChange = vi.fn();
    render(<CurrencyInput value={50} onChange={onChange} />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.blur(input);
    expect(input.value).toBe("50.00");
  });

  it("renders currency symbol", () => {
    render(<CurrencyInput currencySymbol="£" />);
    expect(screen.getByText("£")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CurrencyInput value={100.5} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
