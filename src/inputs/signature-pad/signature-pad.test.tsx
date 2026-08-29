import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SignaturePad } from "./signature-pad";

describe("SignaturePad Primitive", () => {
  it("renders canvas and clear signature button", () => {
    render(<SignaturePad />);
    expect(screen.getByLabelText("Digital signature pad")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear Signature" })).toBeInTheDocument();
  });

  it("clears canvas on clear button click", () => {
    const onSave = vi.fn();
    render(<SignaturePad onSave={onSave} />);
    const clearBtn = screen.getByRole("button", { name: "Clear Signature" });
    fireEvent.click(clearBtn);
    expect(onSave).toHaveBeenCalledWith("");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SignaturePad />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
