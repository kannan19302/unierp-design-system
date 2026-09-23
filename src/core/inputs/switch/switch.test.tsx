import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./switch";

describe("Strata V1 Switch Primitive", () => {
  it("toggles checked state via click and fires onChange", () => {
    const onChange = vi.fn();
    render(<Switch label="Dark Mode" defaultChecked={false} onChange={onChange} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("aria-checked", "false");

    fireEvent.click(switchEl);
    expect(switchEl).toHaveAttribute("aria-checked", "true");
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles via keyboard Space and Enter keys", () => {
    const onChange = vi.fn();
    render(<Switch label="Auto-Renew" defaultChecked={false} onChange={onChange} />);
    const switchEl = screen.getByRole("switch");

    fireEvent.keyDown(switchEl, { key: " " });
    expect(onChange).toHaveBeenCalledWith(true);

    fireEvent.keyDown(switchEl, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("handles controlled state cleanly", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Switch label="Sync" checked={true} onChange={onChange} />);
    const switchEl = screen.getByRole("switch");
    expect(switchEl).toHaveAttribute("aria-checked", "true");

    fireEvent.click(switchEl);
    expect(onChange).toHaveBeenCalledWith(false);

    rerender(<Switch label="Sync" checked={false} onChange={onChange} />);
    expect(switchEl).toHaveAttribute("aria-checked", "false");
  });

  it("prevents interaction when disabled", () => {
    const onChange = vi.fn();
    render(<Switch label="Disabled Switch" disabled onChange={onChange} />);
    const switchEl = screen.getByRole("switch");
    fireEvent.click(switchEl);
    expect(onChange).not.toHaveBeenCalled();
    expect(switchEl).toHaveAttribute("tabindex", "-1");
  });

  it("has zero accessibility violations across states", async () => {
    const { container, rerender } = render(<Switch label="Two-Factor Authentication" />);
    let results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Switch label="Two-Factor Authentication" checked />);
    results = await axe(container);
    expect(results).toHaveNoViolations();

    rerender(<Switch label="Two-Factor Authentication" disabled />);
    results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
