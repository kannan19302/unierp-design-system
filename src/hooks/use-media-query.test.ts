import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "./use-media-query";

describe("useMediaQuery", () => {
  let listeners: Array<(e: { matches: boolean }) => void> = [];

  beforeEach(() => {
    listeners = [];
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("min-width: 1024px"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_, handler) => {
        listeners.push(handler);
      }),
      removeEventListener: vi.fn((_, handler) => {
        listeners = listeners.filter((l) => l !== handler);
      }),
      dispatchEvent: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns true if media query matches initially", () => {
    const { result } = renderHook(() => useMediaQuery("(min-width: 1024px)"));
    expect(result.current).toBe(true);
  });

  it("returns false if media query does not match", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 600px)"));
    expect(result.current).toBe(false);
  });

  it("updates when media query change event fires", () => {
    const { result } = renderHook(() => useMediaQuery("(max-width: 600px)"));
    expect(result.current).toBe(false);

    act(() => {
      listeners.forEach((handler) => handler({ matches: true }));
    });

    expect(result.current).toBe(true);
  });
});
