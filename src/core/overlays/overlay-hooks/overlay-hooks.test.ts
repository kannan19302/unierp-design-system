import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useScrollLock, useEscapeKey, useMenuKeyboard } from "./overlay-hooks";

describe("Overlay Hooks", () => {
  it("locks and unlocks scroll based on active prop", () => {
    const { rerender } = renderHook(({ active }) => useScrollLock(active), {
      initialProps: { active: true },
    });
    expect(document.body.style.overflow).toBe("hidden");

    rerender({ active: false });
    expect(document.body.style.overflow).toBe("");
  });

  it("handles escape key events", () => {
    const onClose = vi.fn();
    renderHook(() => useEscapeKey(onClose, true));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("manages menu keyboard navigation", () => {
    const onClose = vi.fn();
    const items = [
      { key: "item-1", label: "Item 1" },
      { key: "item-2", label: "Item 2", disabled: true },
      { key: "item-3", label: "Item 3" },
    ];

    const { result } = renderHook(() =>
      useMenuKeyboard({ items, open: true, onClose })
    );

    expect(result.current.activeIndex).toBe(-1);
    expect(result.current.enabledIdx).toEqual([0, 2]);
  });
});
