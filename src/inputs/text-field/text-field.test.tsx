import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Search } from "lucide-react";
import { Input, TextField, inputVariants } from "./text-field";

describe("Input Primitive", () => {
  it("renders with placeholder and accepts input", () => {
    const handleChange = vi.fn();
    render(<Input placeholder="Search..." onChange={handleChange} aria-label="Search" />);
    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("data-size", "md");

    fireEvent.change(input, { target: { value: "Ledger" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("Ledger");
  });

  it("renders with icons properly in wrapper with data-slot", () => {
    render(
      <Input
        placeholder="With icon"
        aria-label="Search with icon"
        leftIcon={<Search data-testid="search-icon" size={14} />}
      />
    );
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("With icon")).toBeInTheDocument();
    const wrapper = document.querySelector("[data-slot='input-wrapper']");
    expect(wrapper).toBeInTheDocument();
    const iconSlot = document.querySelector("[data-slot='left-icon']");
    expect(iconSlot).toBeInTheDocument();
  });

  it("sets aria-invalid and data-error on error state", () => {
    render(<Input error placeholder="Error field" aria-label="Error field" />);
    const input = screen.getByPlaceholderText("Error field");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-error", "true");
  });

  it("preserves caller invalid state and exposes read-only without disabling focus", () => {
    render(<Input aria-label="Reference" aria-invalid="true" readOnly value="INV-4" />);
    const input = screen.getByRole("textbox", { name: "Reference" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("readonly");
    input.focus();
    expect(input).toHaveFocus();
  });

  it("forwards ref to underlying HTMLInputElement", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" aria-label="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("supports TextField alias export", () => {
    render(<TextField placeholder="Alias test" aria-label="Alias test" />);
    expect(screen.getByPlaceholderText("Alias test")).toBeInTheDocument();
  });

  it("generates correct class names via inputVariants cva helper", () => {
    const classes = inputVariants({ inputSize: "sm", error: true });
    expect(classes).toContain("sm");
    expect(classes).toContain("error");
  });

  it("has zero accessibility violations across states", async () => {
    const { container } = render(
      <div>
        <label htmlFor="standard-input">Standard</label>
        <Input id="standard-input" placeholder="Enter text" />
        <label htmlFor="disabled-input">Disabled</label>
        <Input id="disabled-input" disabled value="Read only text" />
        <label htmlFor="invalid-input">Invalid</label>
        <Input id="invalid-input" error aria-describedby="err-msg" />
        <span id="err-msg">Field is required</span>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
