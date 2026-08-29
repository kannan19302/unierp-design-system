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

  it("has zero accessibility violations", async () => {
    const { container } = render(<TagInput tags={["tax", "vat"]} onChange={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
