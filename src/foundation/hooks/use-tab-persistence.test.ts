import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTabPersistence } from "./use-tab-persistence";

describe("useTabPersistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("toggles and checks pinned tabs", () => {
    const { result } = renderHook(() => useTabPersistence("sales-orders"));

    expect(result.current.pinned).toEqual([]);
    expect(result.current.isPinned("tab-1")).toBe(false);

    act(() => {
      result.current.togglePin("tab-1");
    });
    expect(result.current.isPinned("tab-1")).toBe(true);
    expect(result.current.pinned).toContain("tab-1");

    // Unpin
    act(() => {
      result.current.togglePin("tab-1");
    });
    expect(result.current.isPinned("tab-1")).toBe(false);
    expect(result.current.pinned).not.toContain("tab-1");
  });

  it("tracks recent tabs up to max limit without duplicates", () => {
    const { result } = renderHook(() => useTabPersistence("finance"));

    act(() => {
      result.current.trackRecent("tab-a");
      result.current.trackRecent("tab-b");
      result.current.trackRecent("tab-c");
    });

    expect(result.current.recent).toEqual(["tab-c", "tab-b", "tab-a"]);

    // Re-tracking moves it to front
    act(() => {
      result.current.trackRecent("tab-a");
    });
    expect(result.current.recent).toEqual(["tab-a", "tab-c", "tab-b"]);
  });

  it("sets and resets custom tab order", () => {
    const { result } = renderHook(() => useTabPersistence("inventory"));

    act(() => {
      result.current.setCustomOrder(["tab-3", "tab-1", "tab-2"]);
    });
    expect(result.current.customOrder).toEqual(["tab-3", "tab-1", "tab-2"]);

    act(() => {
      result.current.resetOrder();
    });
    expect(result.current.customOrder).toEqual([]);
  });
});
