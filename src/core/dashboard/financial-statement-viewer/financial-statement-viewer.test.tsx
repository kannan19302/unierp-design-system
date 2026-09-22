import React, { createRef } from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FinancialStatementViewer } from "./financial-statement-viewer";

const sampleRows = [
  { label: "Revenue", values: [1200000, 1350000], isHeader: true },
  { label: "Product Revenue", values: [900000, 1050000], indent: 1 },
  { label: "Services Revenue", values: [300000, 300000], indent: 1 },
  { label: "COGS", values: [-450000, -500000] },
  { label: "Gross Profit", values: [750000, 850000], isTotal: true },
];

describe("FinancialStatementViewer", () => {
  it("renders without crashing", () => {
    render(
      <FinancialStatementViewer
        title="Income Statement"
        periods={["Q1 2026", "Q2 2026"]}
        rows={sampleRows}
      />
    );
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("forwards ref correctly to container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FinancialStatementViewer
        ref={ref}
        title="Income Statement"
        periods={["Q1 2026", "Q2 2026"]}
        rows={sampleRows}
      />
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FinancialStatementViewer
        title="Income Statement"
        periods={["Q1 2026", "Q2 2026"]}
        rows={sampleRows}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
