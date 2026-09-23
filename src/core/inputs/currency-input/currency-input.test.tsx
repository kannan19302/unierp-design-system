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

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<CurrencyInput density="compact" value={100} />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<CurrencyInput density="ultra-compact" value={100} />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<CurrencyInput density="comfortable" value={100} />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("handles negative amounts and invalid state with error message", () => {
    render(
      <CurrencyInput
        label="Net Deficit"
        value={-250.5}
        invalid
        error="Negative balances prohibited"
      />
    );

    const input = screen.getByRole("spinbutton");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Negative balances prohibited");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<CurrencyInput label="Invoice Total" value={100.5} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
