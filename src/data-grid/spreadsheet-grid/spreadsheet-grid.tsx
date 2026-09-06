"use client";

import {
  useState,
  useRef,
  type FC,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import styles from "./spreadsheet-grid.module.css";

export type SpreadsheetDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface CellPosition {
  rowIndex: number;
  colIndex: number;
}

export interface SpreadsheetGridProps {
  /** Column definitions (headers) */
  columns?: string[];
  /** 2D matrix of data rows */
  initialData?: (string | number)[][];
  /** Callback when data changes */
  onChange?: (data: (string | number)[][]) => void;
  /** Number of rows if initialData is not provided */
  rowCount?: number;
  /** Number of columns if columns is not provided */
  colCount?: number;
  /** Density scale */
  density?: SpreadsheetDensity;
  /** Accessible label */
  ariaLabel?: string;
  className?: string;
}

function getColumnLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = "";
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

/**
 * `<SpreadsheetGrid>` — Inspired by Handsontable (#47), AG Grid Enterprise (#46), and Palantir Blueprint (#16).
 * High-density keyboard-driven matrix grid with coordinate headers (A..Z, 1..N), formula bar, and cell editing.
 */
export const SpreadsheetGrid: FC<SpreadsheetGridProps> = ({
  columns,
  initialData,
  onChange,
  rowCount = 10,
  colCount = 6,
  density = "compact",
  ariaLabel = "Financial Ledger Spreadsheet Grid",
  className = "",
}) => {
  const actualCols = columns ?? Array.from({ length: colCount }, (_, i) => getColumnLetter(i));
  const numCols = actualCols.length;
  const numRows = initialData ? initialData.length : rowCount;

  const [data, setData] = useState<(string | number)[][]>(() => {
    if (initialData && initialData.length > 0) return initialData;
    return Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => ""));
  });

  const [selectedCell, setSelectedCell] = useState<CellPosition>({ rowIndex: 0, colIndex: 0 });
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedColLetter = getColumnLetter(selectedCell.colIndex);
  const selectedCoord = `${selectedColLetter}${selectedCell.rowIndex + 1}`;
  const currentRow = data[selectedCell.rowIndex];
  const activeCellValue =
    currentRow && currentRow[selectedCell.colIndex] !== undefined
      ? String(currentRow[selectedCell.colIndex])
      : "";

  const handleCellClick = (r: number, c: number) => {
    if (editingCell && (editingCell.rowIndex !== r || editingCell.colIndex !== c)) {
      commitEdit();
    }
    setSelectedCell({ rowIndex: r, colIndex: c });
  };

  const handleCellDoubleClick = (r: number, c: number) => {
    setSelectedCell({ rowIndex: r, colIndex: c });
    startEditing(r, c);
  };

  const startEditing = (r: number, c: number) => {
    setEditingCell({ rowIndex: r, colIndex: c });
    const row = data[r];
    setEditValue(row && row[c] !== undefined ? String(row[c]) : "");
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  const commitEdit = () => {
    if (!editingCell) return;
    const newData = data.map((row, r) =>
      row.map((val, c) => {
        if (r === editingCell.rowIndex && c === editingCell.colIndex) {
          return editValue;
        }
        return val;
      })
    );
    setData(newData);
    onChange?.(newData);
    setEditingCell(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
    if (editingCell) {
      if (e.key === "Enter") {
        e.preventDefault();
        commitEdit();
        if (selectedCell.rowIndex < numRows - 1) {
          setSelectedCell((prev) => ({ ...prev, rowIndex: prev.rowIndex + 1 }));
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEdit();
      } else if (e.key === "Tab") {
        e.preventDefault();
        commitEdit();
        if (selectedCell.colIndex < numCols - 1) {
          setSelectedCell((prev) => ({ ...prev, colIndex: prev.colIndex + 1 }));
        } else if (selectedCell.rowIndex < numRows - 1) {
          setSelectedCell((prev) => ({ rowIndex: prev.rowIndex + 1, colIndex: 0 }));
        }
      }
      return;
    }

    let nextR = selectedCell.rowIndex;
    let nextC = selectedCell.colIndex;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      nextR = Math.max(0, nextR - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      nextR = Math.min(numRows - 1, nextR + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextC = Math.max(0, nextC - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextC = Math.min(numCols - 1, nextC + 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      startEditing(selectedCell.rowIndex, selectedCell.colIndex);
      return;
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        nextC = Math.max(0, nextC - 1);
      } else {
        nextC = Math.min(numCols - 1, nextC + 1);
      }
    } else {
      return;
    }

    setSelectedCell({ rowIndex: nextR, colIndex: nextC });
  };

  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      data-density={density}
      data-floorplan="spreadsheet-grid"
    >
      {/* ── Formula Bar ── */}
      <div className={styles.formulaBar}>
        <div className={styles.coordPill} aria-label={`Selected Cell: ${selectedCoord}`}>
          {selectedCoord}
        </div>
        <div className={styles.fxSymbol} aria-hidden="true">
          fx
        </div>
        <input
          type="text"
          className={styles.formulaInput}
          value={editingCell ? editValue : activeCellValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (editingCell) {
              setEditValue(e.target.value);
            } else {
              setEditingCell(selectedCell);
              setEditValue(e.target.value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitEdit();
            } else if (e.key === "Escape") {
              e.preventDefault();
              cancelEdit();
            }
          }}
          aria-label="Formula Bar Input"
        />
      </div>

      {/* ── Table Grid ── */}
      <div className={styles.tableScroll}>
        <table
          className={styles.table}
          role="grid"
          aria-label={ariaLabel}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <thead>
            <tr role="row">
              <th className={styles.cornerHeader} role="columnheader" aria-label="Row Numbers Corner">
                <span className={styles.srOnly}>Row Index</span>
              </th>
              {actualCols.map((colName, cIdx) => (
                <th
                  key={cIdx}
                  className={`${styles.colHeader} ${selectedCell.colIndex === cIdx ? styles.headerActive : ""}`}
                  role="columnheader"
                >
                  {colName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numRows }, (_, rIdx) => (
              <tr key={rIdx} role="row">
                <th
                  className={`${styles.rowHeader} ${selectedCell.rowIndex === rIdx ? styles.headerActive : ""}`}
                  role="rowheader"
                >
                  {rIdx + 1}
                </th>
                {Array.from({ length: numCols }, (_, cIdx) => {
                  const isSelected =
                    selectedCell.rowIndex === rIdx && selectedCell.colIndex === cIdx;
                  const isEditing =
                    editingCell?.rowIndex === rIdx && editingCell?.colIndex === cIdx;
                  const cellVal = data[rIdx]?.[cIdx] ?? "";

                  return (
                    <td
                      key={cIdx}
                      className={`${styles.cell} ${isSelected ? styles.cellSelected : ""}`}
                      role="gridcell"
                      aria-selected={isSelected}
                      onClick={() => handleCellClick(rIdx, cIdx)}
                      onDoubleClick={() => handleCellDoubleClick(rIdx, cIdx)}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="text"
                          className={styles.cellInput}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={commitEdit}
                          aria-label={`Editing Cell ${getColumnLetter(cIdx)}${rIdx + 1}`}
                        />
                      ) : (
                        <span className={styles.cellContent}>{cellVal}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
