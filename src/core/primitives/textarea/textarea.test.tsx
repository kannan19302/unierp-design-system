import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { Textarea } from "./textarea";

describe("Textarea Primitive", () => {
  it("renders with placeholder and handles text entry", () => {
    const handleChange = vi.fn();
    render(<Textarea placeholder="Audit comment" onChange={handleChange} aria-label="Audit comment" />);
    const textarea = screen.getByPlaceholderText("Audit comment") as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: "Reconciliation approved" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea.value).toBe("Reconciliation approved");
  });

  it("sets aria-invalid on error state", () => {
    render(<Textarea error placeholder="Error state" aria-label="Error state" />);
    const textarea = screen.getByPlaceholderText("Error state");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("forwards ref to HTMLTextAreaElement", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Ref check" aria-label="Ref check" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("has zero accessibility violations across states", async () => {
    const { container } = render(
      <div>
        <label htmlFor="standard-textarea">Notes</label>
        <Textarea id="standard-textarea" placeholder="Enter notes" />
        <label htmlFor="disabled-textarea">Disabled Notes</label>
        <Textarea id="disabled-textarea" disabled value="System locked" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
