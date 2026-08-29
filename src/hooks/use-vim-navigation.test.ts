import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVimNavigation } from "./use-vim-navigation";

describe("useVimNavigation", () => {
  it("navigates down with j and up with k", () => {
    const { result } = renderHook(() =>
      useVimNavigation({
        itemCount: 5,
        initialIndex: 0,
      }),
    );

    expect(result.current.focusedIndex).toBe(0);

    // j -> 1
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "j", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.focusedIndex).toBe(1);

    // j -> 2
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "j", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.focusedIndex).toBe(2);

    // k -> 1
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.focusedIndex).toBe(1);
  });

  it("clamps at boundaries (0 and itemCount - 1)", () => {
    const { result } = renderHook(() =>
      useVimNavigation({
        itemCount: 2,
        initialIndex: 0,
      }),
    );

    // k at 0 stays at 0
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "k", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.focusedIndex).toBe(0);

    // j -> 1
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "j", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.focusedIndex).toBe(1);

    // j at 1 stays at 1
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "j", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.focusedIndex).toBe(1);
  });

  it("toggles selection with x and clears with Escape", () => {
    const onToggleSelect = vi.fn();
    const { result } = renderHook(() =>
      useVimNavigation({
        itemCount: 4,
        initialIndex: 1,
        onToggleSelect,
      }),
    );

    // x toggles index 1
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "x", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.selectedIndices.has(1)).toBe(true);
    expect(onToggleSelect).toHaveBeenCalledWith(1);

    // Escape clears selection
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
      );
    });
    expect(result.current.selectedIndices.size).toBe(0);
  });

  it("fires onSelect when pressing Enter or o", () => {
    const onSelect = vi.fn();
    renderHook(() =>
      useVimNavigation({
        itemCount: 3,
        initialIndex: 2,
        onSelect,
      }),
    );

    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
      );
    });
    expect(onSelect).toHaveBeenCalledWith(2);
  });
});
