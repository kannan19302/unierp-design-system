import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { RichTextEditor } from "./rich-text-editor";
import { sanitizeHtml } from "./sanitize-html";

describe("RichTextEditor Primitive", () => {
  it("renders textarea with formatting toolbar", () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="Initial text" onChange={onChange} />);
    const textarea = screen.getByDisplayValue("Initial text");
    expect(textarea).toBeInTheDocument();
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<RichTextEditor density="ultra-compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<RichTextEditor density="comfortable" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("applies bold formatting via toolbar button", () => {
    const onChange = vi.fn();
    render(<RichTextEditor value="hello" onChange={onChange} />);

    const boldBtn = screen.getByRole("button", { name: /bold text formatting/i });
    fireEvent.click(boldBtn);

    expect(onChange).toHaveBeenCalledWith("****hello");
  });

  it("renders error state and sets aria-invalid", () => {
    render(
      <RichTextEditor
        id="rich-test"
        error="Field is required"
        invalid
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Field is required");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("sanitizes dangerous tags correctly", () => {
    const dirty = '<script>alert("hack")</script><p>Safe text</p><img src="x" onerror="alert(1)">';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("onerror");
    expect(clean).toContain("Safe text");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<RichTextEditor label="Invoice notes" value="Invoice details" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
