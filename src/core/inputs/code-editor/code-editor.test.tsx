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

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<CodeEditor density="ultra-compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<CodeEditor density="comfortable" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("renders line numbers when showLineNumbers is true", () => {
    render(<CodeEditor value={"line 1\nline 2\nline 3"} showLineNumbers />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders error message and sets aria-invalid", () => {
    render(
      <CodeEditor
        id="code-test"
        error="Syntax error in line 1"
        invalid
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Syntax error in line 1");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("switches between edit and preview in MarkdownEditor", () => {
    render(<MarkdownEditor value="# Hello World" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    const previewBtn = screen.getByRole("button", { name: /preview/i });
    fireEvent.click(previewBtn);

    expect(screen.getByLabelText("Markdown preview")).toBeInTheDocument();
    expect(screen.getByText("# Hello World")).toBeInTheDocument();
  });

  it("has zero accessibility violations in CodeEditor", async () => {
    const { container } = render(<CodeEditor label="SQL Code" value="SELECT 1;" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in MarkdownEditor", async () => {
    const { container } = render(<MarkdownEditor label="Notes" value="# Title" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
