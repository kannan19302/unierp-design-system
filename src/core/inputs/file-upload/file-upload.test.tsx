import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { FileUpload } from "./file-upload";

describe("FileUpload Primitive", () => {
  it("renders upload callout text", () => {
    render(<FileUpload />);
    expect(screen.getByText("Click or drag files here to upload")).toBeInTheDocument();
  });

  it("handles drag over and drop", () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} />);
    const dropzone = screen.getByRole("button");

    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass(/dragOver/);

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File(["content"], "invoice.pdf", { type: "application/pdf" })],
      },
    });
    expect(onFileSelect).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FileUpload />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
