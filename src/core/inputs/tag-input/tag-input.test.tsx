import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TagInput } from "./tag-input";

describe("TagInput Primitive", () => {
  it("adds a tag when typing and pressing Enter", () => {
    const onChange = vi.fn();
    render(<TagInput tags={["alpha"]} onChange={onChange} placeholder="Add tag" />);
    const input = screen.getByPlaceholderText("Add tag");
    fireEvent.change(input, { target: { value: "beta" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["alpha", "beta"]);
  });

  it("removes a tag on click", () => {
    const onChange = vi.fn();
    render(<TagInput tags={["alpha", "beta"]} onChange={onChange} />);
    const removeBtn = screen.getByLabelText("Remove tag alpha");
    fireEvent.click(removeBtn);
    expect(onChange).toHaveBeenCalledWith(["beta"]);
  });

  it("removes last tag when pressing Backspace in empty input", () => {
    const onChange = vi.fn();
    render(<TagInput tags={["alpha", "beta"]} onChange={onChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "Backspace" });
    expect(onChange).toHaveBeenCalledWith(["alpha"]);
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<TagInput density="compact" tags={["item"]} onChange={() => {}} />);
    expect(container.firstChild).toHaveAttribute("data-density", "compact");

    rerender(<TagInput density="ultra-compact" tags={["item"]} onChange={() => {}} />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<TagInput density="comfortable" tags={["item"]} onChange={() => {}} />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("handles invalid state and displays error message", () => {
    render(
      <TagInput
        label="Account Tags"
        tags={[]}
        onChange={() => {}}
        invalid
        error="At least one tag is required"
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("At least one tag is required");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<TagInput label="Tax Codes" tags={["tax", "vat"]} onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
