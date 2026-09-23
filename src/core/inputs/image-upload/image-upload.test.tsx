import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ImageUpload } from "./image-upload";

describe("ImageUpload Primitive", () => {
  it("renders upload callout text when no image is selected", () => {
    render(<ImageUpload />);
    expect(screen.getByText("Upload image")).toBeInTheDocument();
  });

  it("renders preview image when value is passed", () => {
    render(<ImageUpload value="https://example.com/avatar.png" />);
    expect(screen.getByAltText("Uploaded preview")).toBeInTheDocument();
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<ImageUpload density="ultra-compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<ImageUpload density="comfortable" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("clears image preview when clear button is clicked", () => {
    const onClear = vi.fn();
    render(<ImageUpload value="https://example.com/photo.jpg" onClear={onClear} />);

    const clearBtn = screen.getByRole("button", { name: /remove image/i });
    fireEvent.click(clearBtn);
    expect(onClear).toHaveBeenCalled();
  });

  it("renders error state and sets aria-invalid", () => {
    render(
      <ImageUpload
        id="img-test"
        error="Invalid image format"
        invalid
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid image format");
    expect(screen.getByRole("button", { name: /upload image trigger/i })).toHaveAttribute("aria-invalid", "true");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<ImageUpload label="Avatar Image" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("revokes internally created object URLs on replacement, clear, and unmount, but preserves external URLs", () => {
    const originalCreate = window.URL.createObjectURL;
    const originalRevoke = window.URL.revokeObjectURL;

    const createObjectURLMock = vi.fn().mockReturnValue("blob:http://localhost/test-1");
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    const onChange = vi.fn();
    const { container, rerender, unmount } = render(<ImageUpload onChange={onChange} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const testFile = new File(["dummy image"], "avatar.png", { type: "image/png" });

    // 1. Upload file creates object URL
    fireEvent.change(input, { target: { files: [testFile] } });
    expect(createObjectURLMock).toHaveBeenCalledWith(testFile);
    expect(onChange).toHaveBeenCalledWith("blob:http://localhost/test-1");

    // 2. Rerender with the internally generated URL as value
    rerender(<ImageUpload value="blob:http://localhost/test-1" onChange={onChange} />);

    // 3. Clear revokes the internally created URL
    const clearBtn = screen.getByRole("button", { name: /remove image/i });
    fireEvent.click(clearBtn);
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:http://localhost/test-1");

    revokeObjectURLMock.mockClear();

    // 4. External URL passed as value should NOT be revoked on clear
    rerender(<ImageUpload value="https://external.cdn.com/avatar.jpg" onChange={onChange} />);
    const clearExternalBtn = screen.getByRole("button", { name: /remove image/i });
    fireEvent.click(clearExternalBtn);
    expect(revokeObjectURLMock).not.toHaveBeenCalled();

    // 5. Unmount revokes remaining internally created URLs
    createObjectURLMock.mockReturnValueOnce("blob:http://localhost/test-2");
    rerender(<ImageUpload onChange={onChange} />);
    const input2 = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input2, { target: { files: [testFile] } });
    unmount();
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:http://localhost/test-2");

    window.URL.createObjectURL = originalCreate;
    window.URL.revokeObjectURL = originalRevoke;
  });

  it("isolates stable unique IDs across multiple identical instances on the same page", () => {
    render(
      <div>
        <ImageUpload label="Profile Photo" description="JPEG or PNG" error="Too large" />
        <ImageUpload label="Profile Photo" description="JPEG or PNG" error="Too large" />
      </div>
    );

    const buttons = screen.getAllByRole("button");
    const descriptions = screen.getAllByText("JPEG or PNG");
    const errors = screen.getAllByText("Too large");

    expect(descriptions[0].id).toBeTruthy();
    expect(descriptions[1].id).toBeTruthy();
    expect(descriptions[0].id).not.toBe(descriptions[1].id);

    expect(errors[0].id).toBeTruthy();
    expect(errors[1].id).toBeTruthy();
    expect(errors[0].id).not.toBe(errors[1].id);

    const btn1Desc = buttons[0].getAttribute("aria-describedby");
    const btn2Desc = buttons[1].getAttribute("aria-describedby");

    expect(btn1Desc).toContain(descriptions[0].id);
    expect(btn1Desc).toContain(errors[0].id);
    expect(btn1Desc).not.toContain(descriptions[1].id);

    expect(btn2Desc).toContain(descriptions[1].id);
    expect(btn2Desc).toContain(errors[1].id);
    expect(btn2Desc).not.toContain(descriptions[0].id);
  });
});
