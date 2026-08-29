import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ShortcutCheatSheet } from "./shortcut-cheat-sheet";
import type { ShortcutDefinition } from "../../hooks/use-keyboard-shortcuts";

const testShortcuts: ShortcutDefinition[] = [
  {
    id: "test-cmd",
    keys: "Ctrl+K",
    description: "Open command palette",
    category: "Global",
    handler: vi.fn(),
  },
  {
    id: "test-nav",
    keys: "g d",
    description: "Go to Dashboard",
    category: "Navigation",
    handler: vi.fn(),
  },
];

describe("ShortcutCheatSheet", () => {
  it("renders when open and displays shortcut keys", () => {
    const onClose = vi.fn();
    render(
      <ShortcutCheatSheet
        open={true}
        onClose={onClose}
        shortcuts={testShortcuts}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Keyboard Shortcuts")).toBeInTheDocument();
    expect(screen.getByText("Open command palette")).toBeInTheDocument();
    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
  });

  it("filters shortcuts based on search input", () => {
    render(
      <ShortcutCheatSheet
        open={true}
        onClose={() => {}}
        shortcuts={testShortcuts}
      />
    );

    const input = screen.getByPlaceholderText("Search shortcuts...");
    fireEvent.change(input, { target: { value: "Dashboard" } });

    expect(screen.getByText("Go to Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Open command palette")).not.toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(
      <ShortcutCheatSheet
        open={true}
        onClose={onClose}
        shortcuts={testShortcuts}
      />
    );

    const closeBtn = screen.getByLabelText("Close keyboard shortcuts dialog");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <ShortcutCheatSheet
        open={true}
        onClose={() => {}}
        shortcuts={testShortcuts}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
