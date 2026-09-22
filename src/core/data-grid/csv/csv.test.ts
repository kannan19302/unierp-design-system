import { describe, it, expect } from "vitest";
import { toCsv } from "./csv";
import type { Column } from "../table";

describe("CSV Export Utilities", () => {
  it("converts column headers and row data into compliant CSV string", () => {
    const columns: Column<{ id: string; name: string; amount: number }>[] = [
      { key: "id", header: "ID" },
      { key: "name", header: "Customer" },
      { key: "amount", header: "Amount" },
    ];
    const rows = [
      { id: "1", name: 'Acme, "Corp"', amount: 1500 },
      { id: "2", name: "Globex", amount: 2400 },
    ];

    const csv = toCsv(columns, rows);
    expect(csv).toContain("ID,Customer,Amount");
    expect(csv).toContain('"Acme, ""Corp"""');
    expect(csv).toContain("2,Globex,2400");
  });
});
