import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useExcelClipboard } from "./use-excel-clipboard";

interface RowData {
  id: string;
  sku: string;
  price: number;
}

const mockData: RowData[] = [
  { id: "1", sku: "SKU-100", price: 29.99 },
  { id: "2", sku: "SKU-200", price: 49.99 },
  { id: "3", sku: "SKU-300", price: 99.99 },
];

const mockColumns = [
  { key: "id" },
  { key: "sku" },
  { key: "price" },
];

describe("useExcelClipboard", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("selects a cell range and checks if cells are in range", () => {
    const { result } = renderHook(() =>
      useExcelClipboard({ data: mockData, columns: mockColumns })
    );

    act(() => {
      result.current.startRangeSelection({ rowIndex: 0, colIndex: 0 });
      result.current.updateRangeSelection({ rowIndex: 1, colIndex: 1 });
    });

    expect(result.current.isCellSelected(0, 0)).toBe(true);
    expect(result.current.isCellSelected(0, 1)).toBe(true);
    expect(result.current.isCellSelected(1, 0)).toBe(true);
    expect(result.current.isCellSelected(1, 1)).toBe(true);
    expect(result.current.isCellSelected(2, 2)).toBe(false);
  });

  it("copies TSV data to clipboard", async () => {
    const onCopy = vi.fn();
    const { result } = renderHook(() =>
      useExcelClipboard({
        data: mockData,
        columns: mockColumns,
        onCopySuccess: onCopy,
      })
    );

    act(() => {
      result.current.startRangeSelection({ rowIndex: 0, colIndex: 0 });
      result.current.updateRangeSelection({ rowIndex: 1, colIndex: 2 });
    });

    let tsv: string | null = null;
    await act(async () => {
      tsv = await result.current.copySelectedRange();
    });

    expect(tsv).toBe("1\tSKU-100\t29.99\r\n2\tSKU-200\t49.99");
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(tsv);
    expect(onCopy).toHaveBeenCalledWith(tsv, 6);
  });
});
