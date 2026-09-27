"use client";

import { forwardRef, type ReactNode } from "react";
import type { Column } from "../../compositions/table";
import { Button } from "../../primitives/button";
import { cva, type VariantProps } from "../../foundation/utils/cva";
import styles from "./csv-export.module.css";

// CSV export for DataTable/ListView datasets. Values come from
// Column.exportValue when present, otherwise the raw row property.

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv<T>(columns: Column<T>[], rows: T[]): string {
  const header = columns
    .map((c: any) => csvEscape(typeof c.header === "string" ? c.header : c.key))
    .join(",");
  const lines = rows.map((row: any) =>
    columns
      .map((c: any) =>
        csvEscape(
          c.exportValue
            ? c.exportValue(row)
            : (row as Record<string, unknown>)[c.key],
        ),
      )
      .join(","),
  );
  return [header, ...lines].join("\r\n");
}

/** Build the CSV and trigger a browser download. */
export function exportToCsv<T>(
  columns: Column<T>[],
  rows: T[],
  filename = "export.csv",
): void {
  // BOM so Excel opens UTF-8 correctly
  const blob = new Blob(["\uFEFF" + toCsv(columns, rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const csvExportVariants = cva(styles.csvContainer, {
  variants: {
    density: {
      "ultra-compact": styles.densityUltraCompact,
      compact: styles.densityCompact,
      standard: styles.densityStandard,
      comfortable: styles.densityComfortable,
    },
  },
  defaultVariants: {
    density: "standard",
  },
});

export type CsvExportDensity = "ultra-compact" | "compact" | "standard" | "comfortable";

export interface CsvExportProps<T = any>
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  columns: Column<T>[];
  rows: T[];
  filename?: string;
  density?: CsvExportDensity;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  children?: ReactNode;
}

/**
 * `<CsvExportButton>` provides an enterprise trigger button for exporting table data to RFC-4180 CSV.
 */
export const CsvExportButton = forwardRef<HTMLButtonElement, CsvExportProps>(
  (
    {
      columns,
      rows,
      filename = "export.csv",
      density = "standard",
      variant = "secondary",
      children = "Export CSV",
      className = "",
      ...restProps
    },
    ref
  ) => {
    const buttonSize =
      density === "ultra-compact"
        ? "sm"
        : density === "compact"
        ? "sm"
        : density === "comfortable"
        ? "lg"
        : "md";

    const handleClick = () => {
      exportToCsv(columns, rows, filename);
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={buttonSize}
        onClick={handleClick}
        data-slot="csv-export"
        data-density={density}
        className={className}
        {...restProps}
      >
        <span data-slot="csv-export-label">{children}</span>
      </Button>
    );
  }
);

CsvExportButton.displayName = "CsvExportButton";

export const CsvExport = CsvExportButton;

export interface CsvExportPanelProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof csvExportVariants> {
  columns: Column<T>[];
  rows: T[];
  filename?: string;
  title?: string;
  description?: string;
  showPreview?: boolean;
  density?: CsvExportDensity;
}

/**
 * `<CsvExportPanel>` provides a self-contained preview & export panel for tabular data.
 */
export const CsvExportPanel = forwardRef<HTMLDivElement, CsvExportPanelProps>(
  (
    {
      columns,
      rows,
      filename = "export.csv",
      title = "CSV Export",
      description = "Generates RFC-4180 compliant CSV format.",
      showPreview = true,
      density = "standard",
      className = "",
      ...restProps
    },
    ref
  ) => {
    const rawCsv = showPreview ? toCsv(columns, rows) : "";

    return (
      <div
        ref={ref}
        data-slot="csv-export-panel"
        data-density={density}
        className={csvExportVariants({ density, className })}
        {...restProps}
      >
        <div className={styles.header} data-slot="csv-export-header">
          <div>
            <h4 className={styles.title} data-slot="csv-export-title">{title}</h4>
            {description && (
              <p className={styles.description} data-slot="csv-export-description">
                {description}
              </p>
            )}
          </div>
          <CsvExportButton
            columns={columns}
            rows={rows}
            filename={filename}
            density={density}
            data-slot="csv-export-button"
          />
        </div>
        {showPreview && (
          <pre className={styles.preview} data-slot="csv-export-preview">
            {rawCsv}
          </pre>
        )}
      </div>
    );
  }
);

CsvExportPanel.displayName = "CsvExportPanel";
