import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ColorPicker } from "./color-picker";

describe("ColorPicker Component", () => {
  it("renders trigger button with initial hex code", () => {
    render(<ColorPicker label="Brand Color" value="#0e6b75" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: /Brand Color: #0e6b75/i })).toBeInTheDocument();
    expect(screen.getByText("#0e6b75")).toBeInTheDocument();
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
