import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FinancialStatementViewer } from "./financial-statement-viewer";

const defaultProps = {} as any;

describe("FinancialStatementViewer", () => {
  it("renders without crashing", () => {
    render(<FinancialStatementViewer {...defaultProps} title="Income Statement" periods={['Q1 2026', 'Q2 2026']} rows={[{ label: 'Revenue', values: [1200000, 1350000], isHeader: true }, { label: 'Product Revenue', values: [900000, 1050000], indent: 1 }, { label: 'Services Revenue', values: [300000, 300000], indent: 1 }, { label: 'COGS', values: [-450000, -500000] }, { label: 'Gross Profit', values: [750000, 850000], isTotal: true }]} />);
    expect(document.querySelector('[class*="container"]')).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<FinancialStatementViewer {...defaultProps} title="Income Statement" periods={['Q1 2026', 'Q2 2026']} rows={[{ label: 'Revenue', values: [1200000, 1350000], isHeader: true }, { label: 'Product Revenue', values: [900000, 1050000], indent: 1 }, { label: 'Services Revenue', values: [300000, 300000], indent: 1 }, { label: 'COGS', values: [-450000, -500000] }, { label: 'Gross Profit', values: [750000, 850000], isTotal: true }]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
