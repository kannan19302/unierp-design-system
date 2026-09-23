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
    const dropzone = screen.getByRole("button", { name: /upload files dropzone/i });

    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass(/dragOver/);

    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File(["content"], "invoice.pdf", { type: "application/pdf" })],
      },
    });
    expect(onFileSelect).toHaveBeenCalled();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<FileUpload density="ultra-compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<FileUpload density="comfortable" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("renders file staging list and triggers removal", () => {
    const onFileRemove = vi.fn();
    render(
      <FileUpload
        files={[
          { name: "test-doc.pdf", size: 2048, status: "done" },
        ]}
        onFileRemove={onFileRemove}
      />,
    );

    expect(screen.getByText("test-doc.pdf")).toBeInTheDocument();
    expect(screen.getByText("2 KB")).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", { name: /remove file test-doc\.pdf/i });
    fireEvent.click(removeBtn);
    expect(onFileRemove).toHaveBeenCalledWith(0);
  });

  it("displays error message and sets aria-invalid", () => {
    render(
      <FileUpload
        id="file-test"
        error="File size exceeds quota"
        invalid
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("File size exceeds quota");
    expect(screen.getByRole("button", { name: /upload files dropzone/i })).toHaveAttribute("aria-invalid", "true");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FileUpload
        label="Receipt Upload"
        files={[{ name: "invoice.pdf", size: 1024, status: "done" }]}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders accurate format subtext without chunked resumable upload claim", () => {
    const { rerender } = render(<FileUpload accept=".pdf,.png" />);
    expect(screen.getByText("Accepted formats: .pdf,.png")).toBeInTheDocument();
    expect(screen.queryByText(/Supports chunked resumable upload/i)).not.toBeInTheDocument();

    rerender(<FileUpload />);
    expect(screen.getByText("Drag and drop or browse from your device")).toBeInTheDocument();
    expect(screen.queryByText(/Supports chunked resumable upload/i)).not.toBeInTheDocument();
  });

  it("isolates stable unique IDs across multiple identical instances on the same page", () => {
    const { container } = render(
      <div>
        <FileUpload
          label="Attachment"
          description="First description"
          error="First error"
        />
        <FileUpload
          label="Attachment"
          description="Second description"
          error="Second error"
        />
      </div>
    );

    const dropzones = screen.getAllByRole("button");
    const labels = screen.getAllByText("Attachment");
    const desc1 = screen.getByText("First description");
    const desc2 = screen.getByText("Second description");
    const err1 = screen.getByText("First error");
    const err2 = screen.getByText("Second error");

    // Descriptions and errors must have different IDs
    expect(desc1.id).toBeTruthy();
    expect(desc2.id).toBeTruthy();
    expect(desc1.id).not.toBe(desc2.id);

    expect(err1.id).toBeTruthy();
    expect(err2.id).toBeTruthy();
    expect(err1.id).not.toBe(err2.id);

    // Dropzone aria-describedby must match respective elements
    const dropzone1Desc = dropzones[0].getAttribute("aria-describedby");
    const dropzone2Desc = dropzones[1].getAttribute("aria-describedby");

    expect(dropzone1Desc).toContain(desc1.id);
    expect(dropzone1Desc).toContain(err1.id);
    expect(dropzone1Desc).not.toContain(desc2.id);

    expect(dropzone2Desc).toContain(desc2.id);
    expect(dropzone2Desc).toContain(err2.id);
    expect(dropzone2Desc).not.toContain(desc1.id);
  });
});
