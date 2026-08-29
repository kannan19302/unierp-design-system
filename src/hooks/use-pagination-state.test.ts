import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePaginationState } from "./use-pagination-state";

describe("usePaginationState", () => {
  it("initializes with default page 1 and calculated totalPages", () => {
    const { result } = renderHook(() => usePaginationState(100, 20));

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.offset).toBe(0);
  });

  it("advances and navigates pages within bounds", () => {
    const { result } = renderHook(() => usePaginationState(45, 10));

    expect(result.current.totalPages).toBe(5);

    act(() => {
      result.current.next();
    });
    expect(result.current.page).toBe(2);
    expect(result.current.offset).toBe(10);

    act(() => {
      result.current.setPage(5);
    });
    expect(result.current.page).toBe(5);
    expect(result.current.offset).toBe(40);

    // Cannot advance past totalPages
    act(() => {
      result.current.next();
    });
    expect(result.current.page).toBe(5);

    // Prev
    act(() => {
      result.current.prev();
    });
    expect(result.current.page).toBe(4);

    // Cannot go below page 1
    act(() => {
      result.current.setPage(-1);
    });
    expect(result.current.page).toBe(1);
  });

  it("resets to page 1 when pageSize changes", () => {
    const { result } = renderHook(() => usePaginationState(100, 10));

    act(() => {
      result.current.setPage(4);
    });
    expect(result.current.page).toBe(4);

    act(() => {
      result.current.setPageSize(25);
    });
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(25);
    expect(result.current.totalPages).toBe(4);
  });
});
