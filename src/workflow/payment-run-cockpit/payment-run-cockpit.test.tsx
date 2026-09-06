import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PaymentRunCockpit, type PayableInvoice } from "./payment-run-cockpit";

const testInvoices: PayableInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-8901",
    vendorName: "Amazon Web Services Inc",
    amount: 14250.0,
    currency: "USD",
    dueDate: "2026-09-10",
    discountAvailable: 285.0,
    rail: "ach",
    bankAccountMasked: "•••• 4419",
    riskScore: 8,
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-8902",
    vendorName: "SAP Deutschland SE",
    amount: 48900.0,
    currency: "USD",
    dueDate: "2026-09-08",
    rail: "wire",
    bankAccountMasked: "•••• 9012",
    riskScore: 65,
  },
];

describe("PaymentRunCockpit", () => {
  it("renders payment run details and summaries correctly", () => {
    render(
      <PaymentRunCockpit
        runBatchId="PR-2026-0906-01"
        title="AP Disbursement Run"
        invoices={testInvoices}
      />
    );

    expect(screen.getByText("PR-2026-0906-01")).toBeInTheDocument();
    expect(screen.getByText("AP Disbursement Run")).toBeInTheDocument();
    expect(screen.getByText("Amazon Web Services Inc")).toBeInTheDocument();
    expect(screen.getByText("SAP Deutschland SE")).toBeInTheDocument();
  });

  it("handles payment rail filtering and batch execution callback", () => {
    const onExecute = vi.fn();
    render(
      <PaymentRunCockpit
        invoices={testInvoices}
        onExecutePaymentRun={onExecute}
      />
    );

    const wireBtn = screen.getByRole("radio", { name: /WIRE/i });
    fireEvent.click(wireBtn);

    expect(screen.getByText("SAP Deutschland SE")).toBeInTheDocument();
    expect(screen.queryByText("Amazon Web Services Inc")).not.toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /Authorize & Transmit/i });
    fireEvent.click(submitBtn);

    expect(onExecute).toHaveBeenCalled();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <PaymentRunCockpit
        runBatchId="PR-2026-0906-01"
        invoices={testInvoices}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
