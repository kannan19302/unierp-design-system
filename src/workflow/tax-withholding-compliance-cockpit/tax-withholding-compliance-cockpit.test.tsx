import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { TaxWithholdingComplianceCockpit } from "./tax-withholding-compliance-cockpit";

const mockVendors = [
  {
    id: "v_1",
    vendorLegalName: "Acme Consulting",
    tinMasked: "••-•••1234",
    formType: "W_9" as const,
    tinStatus: "TIN_MATCHED" as const,
    ytdSpendUsd: 15000,
    withholdingStatus: "NONE" as const,
  },
  {
    id: "v_2",
    vendorLegalName: "Beta Logistics",
    tinMasked: "••-•••5678",
    formType: "W_9" as const,
    tinStatus: "B_NOTICE_ISSUED" as const,
    ytdSpendUsd: 20000,
    withholdingStatus: "ACTIVE_24_PCT" as const,
  },
];

describe("TaxWithholdingComplianceCockpit", () => {
  it("passes axe accessibility tests with zero violations", async () => {
    const { container } = render(<TaxWithholdingComplianceCockpit vendors={mockVendors} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders header, KPI metrics, and vendor names", () => {
    render(<TaxWithholdingComplianceCockpit vendors={mockVendors} />);
    expect(
      screen.getByText("Vendor 1099 Tax Compliance & Backup Withholding Cockpit")
    ).toBeInTheDocument();
    expect(screen.getByText("Acme Consulting")).toBeInTheDocument();
    expect(screen.getByText("Beta Logistics")).toBeInTheDocument();
  });

  it("filters vendors by TIN match status", () => {
    render(<TaxWithholdingComplianceCockpit vendors={mockVendors} />);
    const select = screen.getByLabelText("TIN Validation:");

    fireEvent.change(select, { target: { value: "B_NOTICE_ISSUED" } });
    expect(screen.queryByText("Acme Consulting")).not.toBeInTheDocument();
    expect(screen.getByText("Beta Logistics")).toBeInTheDocument();
  });

  it("dispatches IRS FIRE batch on button click", () => {
    const handleFire = vi.fn();
    render(
      <TaxWithholdingComplianceCockpit
        vendors={mockVendors}
        onGenerateFireBatch={handleFire}
      />
    );

    const fireBtn = screen.getByRole("button", {
      name: /generate electronic irs fire filing batch/i,
    });
    fireEvent.click(fireBtn);

    expect(handleFire).toHaveBeenCalledTimes(1);
    expect(screen.getByText("IRS FIRE BATCH DISPATCHED")).toBeInTheDocument();
  });
});
