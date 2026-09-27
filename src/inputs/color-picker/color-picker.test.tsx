import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ColorPicker, getContrastRatio } from "./color-picker";

describe("ColorPicker Component", () => {
  it("renders trigger button with initial hex code", () => {
    render(<ColorPicker label="Brand Color" value="#0e6b75" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /Brand Color: #0e6b75/i })).toBeInTheDocument();
    expect(screen.getByText("#0e6b75")).toBeInTheDocument();
  });

  it("calculates accurate contrast ratio for known color pairs", () => {
    // Pure black on white is 21:1
    expect(getContrastRatio("#000000", "#ffffff")).toBe(21);
    // Pure white on black is 21:1
    expect(getContrastRatio("#ffffff", "#000000")).toBe(21);
    // Pure red on white is 4:1 (fails standard 4.5:1 AA)
    expect(getContrastRatio("#ff0000", "#ffffff")).toBe(4);
    // Dark navy on white is 16:1 (passes AAA >= 7.0:1)
    expect(getContrastRatio("#000080", "#ffffff")).toBe(16);
    // Brand teal #0e6b75 on white is 6.2:1 (passes AA >= 4.5:1)
    expect(getContrastRatio("#0e6b75", "#ffffff")).toBe(6.2);
  });

  it("displays accurate contrast ratio and badge in open dialog", () => {
    // Render with AAA color (#000000 on white)
    const { rerender } = render(
      <ColorPicker label="Color" value="#000000" contrastBackgroundHex="#ffffff" onChange={() => {}} />
    );
    fireEvent.click(screen.getByRole("button", { name: /Color: #000000/i }));

    expect(screen.getByTestId("contrast-ratio")).toHaveTextContent("21:1");
    expect(screen.getByTestId("contrast-badge")).toHaveTextContent("AAA");

    // Close and rerender with Fail color (#ff0000)
    rerender(
      <ColorPicker label="Color" value="#ff0000" contrastBackgroundHex="#ffffff" onChange={() => {}} />
    );
    expect(screen.getByTestId("contrast-ratio")).toHaveTextContent("4:1");
    expect(screen.getByTestId("contrast-badge")).toHaveTextContent("Fail");

    // Rerender with AA color (#0e6b75)
    rerender(
      <ColorPicker label="Color" value="#0e6b75" contrastBackgroundHex="#ffffff" onChange={() => {}} />
    );
    expect(screen.getByTestId("contrast-ratio")).toHaveTextContent("6.2:1");
    expect(screen.getByTestId("contrast-badge")).toHaveTextContent("AA");
  });

  it("opens popover dialog when clicked and allows preset selection", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#0e6b75" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /Choose color: #0e6b75/i }));

    const dialog = screen.getByRole("dialog", { name: "Color selection panel" });
    expect(dialog).toBeInTheDocument();

    const redPreset = screen.getByRole("button", { name: /Select color #b3121f/i });
    fireEvent.click(redPreset);

    expect(onChange).toHaveBeenCalledWith("#b3121f");
  });

  it("generates stable unique per-instance IDs for multiple identical pickers", () => {
    render(
      <>
        <ColorPicker label="Accent Color" value="#0e6b75" onChange={() => {}} />
        <ColorPicker label="Accent Color" value="#1d4ed8" onChange={() => {}} />
      </>
    );

    const buttons = screen.getAllByRole("button", { name: /Accent Color/i });
    expect(buttons).toHaveLength(2);
    expect(buttons[0]?.id).not.toBe(buttons[1]?.id);

    const labels = screen.getAllByText("Accent Color");
    expect(labels[0]).toHaveAttribute("for", buttons[0]?.id);
    expect(labels[1]).toHaveAttribute("for", buttons[1]?.id);
  });

  it("supports 4-tier density scaling", () => {
    const { container, rerender } = render(
      <ColorPicker density="ultra-compact" value="#0e6b75" onChange={() => {}} />,
    );
    expect(container.firstChild).toHaveAttribute("data-density", "ultra-compact");

    rerender(<ColorPicker density="comfortable" value="#0e6b75" onChange={() => {}} />);
    expect(container.firstChild).toHaveAttribute("data-density", "comfortable");
  });

  it("renders error message and sets aria-invalid", () => {
    render(
      <ColorPicker
        id="color-test"
        value="#0e6b75"
        onChange={() => {}}
        error="Invalid brand color"
        invalid
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid brand color");
    expect(screen.getByRole("button")).toHaveAttribute("aria-invalid", "true");
  });

  it("has zero accessibility violations in closed state", async () => {
    const { container } = render(
      <ColorPicker label="Theme Accent" value="#0e6b75" onChange={() => {}} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has zero accessibility violations in open state", async () => {
    const { container } = render(
      <ColorPicker label="Theme Accent" value="#0e6b75" onChange={() => {}} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Theme Accent: #0e6b75/i }));

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
