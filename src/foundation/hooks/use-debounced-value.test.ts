import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "./use-debounced-value";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 300));
    expect(result.current).toBe("initial");
  });

  it("updates value only after specified delayMs", () => {
    let value = "hello";
    const { result, rerender } = renderHook(() => useDebouncedValue(value, 300));

    expect(result.current).toBe("hello");

    value = "world";
    rerender();

    // Value should not have updated yet
    expect(result.current).toBe("hello");

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("hello");

    // Advance to complete delay
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe("world");
  });

  it("cancels pending update if value changes rapidly", () => {
    let value = "first";
    const { result, rerender } = renderHook(() => useDebouncedValue(value, 300));

    value = "second";
    rerender();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("first");

    // Rapid change before timer fires
    value = "third";
    rerender();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Should still be first because timer was reset
    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("third");
  });
});
