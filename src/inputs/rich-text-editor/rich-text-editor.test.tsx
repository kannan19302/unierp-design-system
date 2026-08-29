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
  });

  it("sanitizes dangerous tags correctly", () => {
    const dirty = '<script>alert("hack")</script><p>Safe text</p><img src="x" onerror="alert(1)">';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).not.toContain("onerror");
    expect(clean).toContain("Safe text");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<RichTextEditor value="Invoice details" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
