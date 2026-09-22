import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./switch";

describe("Switch Primitive", () => {
  it("toggles aria-checked state on click", () => {
    const onChange = vi.fn();
    render(<Switch label="Dark Mode" onChange={onChange} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("aria-checked", "false");
    fireEvent.click(switchEl);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles on Space keypress", () => {
    const onChange = vi.fn();
    render(<Switch label="Sound" onChange={onChange} />);
    const switchEl = screen.getByRole("switch");
    fireEvent.keyDown(switchEl, { key: " " });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<Switch label="Notifications" defaultChecked />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
