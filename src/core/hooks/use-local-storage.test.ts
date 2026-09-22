import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage, removeStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reads fallback value when key is absent", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default-val"));
    expect(result.current[0]).toBe("default-val");
  });

  it("updates value and persists to localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default-val"));

    act(() => {
      result.current[1]("new-val");
    });

    expect(result.current[0]).toBe("new-val");
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("new-val"));
  });

  it("supports updater function", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 10));

    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(localStorage.getItem("counter")).toBe("15");
  });

  it("handles removal via removeStorage", () => {
    localStorage.setItem("remove-me", JSON.stringify("stored"));
    expect(localStorage.getItem("remove-me")).toBe(JSON.stringify("stored"));

    removeStorage("remove-me");
    expect(localStorage.getItem("remove-me")).toBeNull();
  });

  it("handles corrupted JSON gracefully by returning fallback", () => {
    localStorage.setItem("corrupted", "not valid json {");
    const { result } = renderHook(() => useLocalStorage("corrupted", { fallback: true }));
    expect(result.current[0]).toEqual({ fallback: true });
  });
});
