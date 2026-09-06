import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TaxEngineBreakdownTable, type TaxLineItem } from "./tax-engine-breakdown-table";

const testTaxLines: TaxLineItem[] = [
  {
    id: "tax-1",
    jurisdictionName: "State of California Sales Tax",
    jurisdictionCode: "US-CA",
    level: "state",
    taxableBase: 100000.0,
    ratePercent: 6.0,
    calculatedTax: 6000.0,
    exemptionStatus: "none",
  },
  {
    id: "tax-2",
    jurisdictionName: "San Jose Municipal Tax",
    jurisdictionCode: "US-CA-SJO",
    level: "city",
    taxableBase: 100000.0,
    ratePercent: 1.5,
    calculatedTax: 1500.0,
    exemptionStatus: "none",
  },
];

describe("TaxEngineBreakdownTable", () => {
  it("renders tax lines and computes effective rate correctly", () => {
    render(
      <TaxEngineBreakdownTable
        title="California Tax Schedule"
        transactionRef="TXN-901"
        lineItems={testTaxLines}
      />
    );

    expect(screen.getByText("California Tax Schedule")).toBeInTheDocument();
    expect(screen.getByText("TXN-901")).toBeInTheDocument();
    expect(screen.getByText("State of California Sales Tax")).toBeInTheDocument();
    expect(screen.getByText("San Jose Municipal Tax")).toBeInTheDocument();
  });

  it("opens override dialog and applies manual tax override", () => {
    const onOverride = vi.fn();
    render(
      <TaxEngineBreakdownTable
        lineItems={testTaxLines}
        onTaxOverride={onOverride}
      />
    );

    const overrideBtns = screen.getAllByRole("button", { name: /Override Rate/i });
    fireEvent.click(overrideBtns[0]);

    expect(screen.getByText(/Manual Tax Rate Override/i)).toBeInTheDocument();

    const rateInput = screen.getByLabelText(/New Tax Rate/i);
    fireEvent.change(rateInput, { target: { value: "4.5" } });

    const reasonInput = screen.getByLabelText(/Audit Exemption/i);
    fireEvent.change(reasonInput, { target: { value: "State enterprise zone deduction" } });

    const submitBtn = screen.getByRole("button", { name: /Apply Tax Override/i });
    fireEvent.click(submitBtn);

    expect(onOverride).toHaveBeenCalledWith("tax-1", 4.5, "State enterprise zone deduction");
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <TaxEngineBreakdownTable
        title="California Tax Schedule"
        transactionRef="TXN-901"
        lineItems={testTaxLines}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
