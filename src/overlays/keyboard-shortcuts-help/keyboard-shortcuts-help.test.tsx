import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { KeyboardShortcutsHelp } from "./keyboard-shortcuts-help";

describe("KeyboardShortcutsHelp", () => {
  it("groups consumer-supplied shortcuts in a named dialog", () => {
    render(
      <KeyboardShortcutsHelp
        isOpen
        onClose={vi.fn()}
        title="Finance shortcuts"
        shortcuts={[
          { group: "Navigation", keys: "Ctrl K", label: "Open search" },
          { group: "View", keys: "Ctrl B", label: "Toggle sidebar" },
        ]}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Finance shortcuts" })).toBeTruthy();
    expect(screen.getByText("Open search")).toBeTruthy();
    expect(screen.getByText("Ctrl K")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Navigation" })).toBeTruthy();
  });

  it("does not render while closed", () => {
    render(<KeyboardShortcutsHelp isOpen={false} onClose={vi.fn()} shortcuts={[]} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
