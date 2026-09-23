import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { Search } from "lucide-react";
import { Input } from "./input";

describe("Input Primitive", () => {
  it("renders with placeholder and accepts input", () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Search..." onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Ledger" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("Ledger");
  });

  it("renders with icons properly in wrapper", () => {
    render(
      <Input
        placeholder="With icon"
        leftIcon={<Search data-testid="search-icon" size={14} />}
      />
    );
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("With icon")).toBeInTheDocument();
  });

  it("sets aria-invalid on error state", () => {
    render(<Input error placeholder="Error field" />);
    const input = screen.getByPlaceholderText("Error field");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards ref to underlying HTMLInputElement", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
