import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { axe } from "vitest-axe";
import { SignaturePad } from "./signature-pad";

describe("SignaturePad Primitive", () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,mockSignature");
  });

  it("renders canvas and clear signature button in draw mode", () => {
    render(<SignaturePad />);
    expect(screen.getByLabelText("Digital signature drawing pad")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear Signature" })).toBeInTheDocument();
  });

  it("supports switching to accessible Type mode via keyboard and submitting typed signature", () => {
    const onSave = vi.fn();
    render(<SignaturePad onSave={onSave} label="Executive Sign-off" />);

    // Switch to Type mode
    const typeTab = screen.getByRole("tab", { name: /type/i });
    fireEvent.click(typeTab);
    expect(typeTab).toHaveAttribute("aria-selected", "true");

    // Accessible text input is now present and reachable
    const typeInput = screen.getByRole("textbox", { name: /type your full legal name/i });
    expect(typeInput).toBeInTheDocument();

    // Type signature
    fireEvent.change(typeInput, { target: { value: "Johnathan Doe" } });
    expect(onSave).toHaveBeenCalledWith("data:image/png;base64,mockSignature");

    // Clear typed signature
    const clearBtn = screen.getByRole("button", { name: "Clear Signature" });
    fireEvent.click(clearBtn);
    expect(typeInput).toHaveValue("");
    expect(onSave).toHaveBeenCalledWith("");
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(<SignaturePad density="ultra-compact" />);
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<SignaturePad density="comfortable" />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("generates stable unique per-instance IDs for multiple pads on the same page", () => {
    render(
      <>
        <SignaturePad label="Signatory A" />
        <SignaturePad label="Signatory B" />
      </>
    );

    const tabs = screen.getAllByRole("tab", { name: /draw/i });
    expect(tabs).toHaveLength(2);
    expect(tabs[0]?.getAttribute("aria-controls")).not.toBe(tabs[1]?.getAttribute("aria-controls"));
  });

  it("renders error message and sets aria-invalid", () => {
    render(
      <SignaturePad
        id="sig-test"
        error="Signature is required"
        invalid
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Signature is required");
    expect(screen.getByLabelText("Digital signature drawing pad")).toHaveAttribute("aria-invalid", "true");
  });

  it("has zero accessibility violations in draw mode", async () => {
    const { container } = render(<SignaturePad label="Sign Document" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in type mode", async () => {
    const { container } = render(<SignaturePad label="Sign Document" />);
    const typeTab = screen.getByRole("tab", { name: /type/i });
    fireEvent.click(typeTab);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
