import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDisclosure } from "./use-disclosure";

describe("useDisclosure", () => {
  it("defaults to closed (false)", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it("respects initialOpen parameter", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it("opens, closes, and toggles state correctly", () => {
    const { result } = renderHook(() => useDisclosure(false));

    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
