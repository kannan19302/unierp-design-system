import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { KeyboardShortcutLegend } from "./keyboard-shortcut-legend";

const sampleShortcuts = [
  { id: "s1", label: "Open Enterprise Command Ribbon", keys: ["Ctrl", "K"], category: "Global Navigation" },
  { id: "s3", label: "New Transaction Record", keys: ["Alt", "N"], category: "Record Actions" },
];

describe("KeyboardShortcutLegend", () => {
  it("renders shortcuts and handles search filtering", () => {
    render(
      <KeyboardShortcutLegend
        shortcuts={sampleShortcuts}
        isOpen={true}
        title="Keyboard Shortcuts"
      />
    );

    expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Open Enterprise Command Ribbon")).toBeInTheDocument();
    expect(screen.getByText("New Transaction Record")).toBeInTheDocument();

    const input = screen.getByRole("textbox", { name: /Filter shortcuts/i });
    fireEvent.change(input, { target: { value: "Ribbon" } });

    expect(screen.getByText("Open Enterprise Command Ribbon")).toBeInTheDocument();
    expect(screen.queryByText("New Transaction Record")).not.toBeInTheDocument();
  });

  it("handles close button and escape key", () => {
    const handleClose = vi.fn();
    render(
      <KeyboardShortcutLegend
        shortcuts={sampleShortcuts}
        isOpen={true}
        onClose={handleClose}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /Close keyboard shortcuts dialog/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <KeyboardShortcutLegend
        shortcuts={sampleShortcuts}
        isOpen={true}
        title="Keyboard Shortcuts"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
