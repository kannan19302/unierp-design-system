"use client";

import { useState, useCallback, useEffect } from "react";

export interface CellPosition {
  rowIndex: number;
  colIndex: number;
}

export interface CellRange {
  start: CellPosition;
  end: CellPosition;
}

export interface UseExcelClipboardOptions<T> {
  data: T[];
  columns: Array<{
    key: string;
    exportValue?: (row: T) => string | number | boolean | null | undefined;
  }>;
  enabled?: boolean;
  onCopySuccess?: (copiedText: string, cellCount: number) => void;
}

export interface UseExcelClipboardReturn {
  selectedRange: CellRange | null;
  setSelectedRange: (range: CellRange | null) => void;
  isCellSelected: (rowIndex: number, colIndex: number) => boolean;
  startRangeSelection: (pos: CellPosition) => void;
  updateRangeSelection: (pos: CellPosition) => void;
  clearRangeSelection: () => void;
  copySelectedRange: () => Promise<string | null>;
}

export function useExcelClipboard<T>({
  data,
  columns,
  enabled = true,
  onCopySuccess,
}: UseExcelClipboardOptions<T>): UseExcelClipboardReturn {
  const [selectedRange, setSelectedRange] = useState<CellRange | null>(null);

  const startRangeSelection = useCallback((pos: CellPosition) => {
    setSelectedRange({ start: pos, end: pos });
  }, []);

  const updateRangeSelection = useCallback((pos: CellPosition) => {
    setSelectedRange((prev) => (prev ? { start: prev.start, end: pos } : { start: pos, end: pos }));
  }, []);

  const clearRangeSelection = useCallback(() => {
    setSelectedRange(null);
  }, []);

  const isCellSelected = useCallback(
    (rowIndex: number, colIndex: number): boolean => {
      if (!selectedRange) return false;
      const minRow = Math.min(selectedRange.start.rowIndex, selectedRange.end.rowIndex);
      const maxRow = Math.max(selectedRange.start.rowIndex, selectedRange.end.rowIndex);
      const minCol = Math.min(selectedRange.start.colIndex, selectedRange.end.colIndex);
      const maxCol = Math.max(selectedRange.start.colIndex, selectedRange.end.colIndex);

      return (
        rowIndex >= minRow &&
        rowIndex <= maxRow &&
        colIndex >= minCol &&
        colIndex <= maxCol
      );
    },
    [selectedRange]
  );

  const copySelectedRange = useCallback(async (): Promise<string | null> => {
    if (!selectedRange || data.length === 0 || columns.length === 0) return null;

    const minRow = Math.min(selectedRange.start.rowIndex, selectedRange.end.rowIndex);
    const maxRow = Math.max(selectedRange.start.rowIndex, selectedRange.end.rowIndex);
    const minCol = Math.min(selectedRange.start.colIndex, selectedRange.end.colIndex);
    const maxCol = Math.max(selectedRange.start.colIndex, selectedRange.end.colIndex);

    const rows: string[] = [];
    let cellCount = 0;

    for (let r = minRow; r <= maxRow; r++) {
      const rowItem = data[r];
      if (!rowItem) continue;

      const cells: string[] = [];
      for (let c = minCol; c <= maxCol; c++) {
        const colDef = columns[c];
        if (!colDef) continue;

        let val: string | number | boolean | null | undefined;
        if (colDef.exportValue) {
          val = colDef.exportValue(rowItem);
        } else {
          val = (rowItem as Record<string, unknown>)[colDef.key] as
            | string
            | number
            | boolean
            | null
            | undefined;
        }

        const formatted = val === null || val === undefined ? "" : String(val);
        cells.push(formatted.replace(/\t/g, " ").replace(/\n/g, " "));
        cellCount++;
      }
      rows.push(cells.join("\t"));
    }

    const tsvString = rows.join("\r\n");

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(tsvString);
        onCopySuccess?.(tsvString, cellCount);
      } catch {
        // Fallback or permission blocked
      }
    }

    return tsvString;
  }, [selectedRange, data, columns, onCopySuccess]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        if (selectedRange) {
          e.preventDefault();
          copySelectedRange();
        }
      } else if (e.key === "Escape") {
        clearRangeSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, selectedRange, copySelectedRange, clearRangeSelection]);

  return {
    selectedRange,
    setSelectedRange,
    isCellSelected,
    startRangeSelection,
    updateRangeSelection,
    clearRangeSelection,
    copySelectedRange,
  };
}
