import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  useKeyboardShortcuts,
  getRegisteredShortcuts,
  type ShortcutDefinition,
} from "./use-keyboard-shortcuts";

describe("useKeyboardShortcuts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("registers and discovers shortcuts in global registry", () => {
    const handler = vi.fn();
    const shortcuts: ShortcutDefinition[] = [
      {
        id: "test-save",
        keys: "Ctrl+S",
        description: "Save changes",
        category: "Global",
        handler,
      },
    ];

    const { unmount } = renderHook(() => useKeyboardShortcuts(shortcuts));

    const registered = getRegisteredShortcuts();
    expect(registered.some((s) => s.id === "test-save")).toBe(true);

    unmount();
    const afterUnmount = getRegisteredShortcuts();
    expect(afterUnmount.some((s) => s.id === "test-save")).toBe(false);
  });

  it("triggers handler on matching modifier key combination", () => {
    const handler = vi.fn();
    const shortcuts: ShortcutDefinition[] = [
      {
        id: "test-cmd-k",
        keys: "Ctrl+K",
        description: "Open palette",
        category: "Global",
        handler,
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    const event = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("triggers handler on 2-key chord sequence (e.g. g then d)", () => {
    const handler = vi.fn();
    const shortcuts: ShortcutDefinition[] = [
      {
        id: "goto-dashboard",
        keys: "g d",
        description: "Go to dashboard",
        category: "Navigation",
        handler,
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // First key 'g'
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "g", bubbles: true, cancelable: true }),
    );
    expect(handler).not.toHaveBeenCalled();

    // Second key 'd'
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "d", bubbles: true, cancelable: true }),
    );
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("suppresses shortcut when typing inside input unless allowInInputs is set", () => {
    const handler = vi.fn();
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    const shortcuts: ShortcutDefinition[] = [
      {
        id: "no-input",
        keys: "/",
        description: "Focus search",
        category: "Navigation",
        handler,
      },
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "/", bubbles: true, cancelable: true }),
    );
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });
});
