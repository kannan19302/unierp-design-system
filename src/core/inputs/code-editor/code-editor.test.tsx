import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CodeEditor } from "./code-editor";
import { MarkdownEditor } from "./markdown-editor";

describe("CodeEditor Primitive", () => {
  it("renders language badge and code value", () => {
    render(<CodeEditor language="graphql" value="query { accounts { id } }" />);
    expect(screen.getByText("graphql")).toBeInTheDocument();
    expect(screen.getByDisplayValue("query { accounts { id } }")).toBeInTheDocument();
  });

  it("handles code typing", () => {
    const onChange = vi.fn();
    render(<CodeEditor onChange={onChange} />);
    const textarea = screen.getByPlaceholderText("// Code editor...");
    fireEvent.change(textarea, { target: { value: "const x = 1;" } });
    expect(onChange).toHaveBeenCalledWith("const x = 1;");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<MarkdownEditor value="# Title" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
