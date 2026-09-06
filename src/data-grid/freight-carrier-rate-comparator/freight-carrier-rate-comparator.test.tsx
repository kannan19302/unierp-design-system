import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  FreightCarrierRateComparator,
  FreightCarrierQuote,
  FreightLaneSpecification,
} from "./freight-carrier-rate-comparator";

const sampleLane: FreightLaneSpecification = {
  originPostal: "60666 (Chicago, IL)",
  destinationPostal: "75261 (Dallas, TX)",
  palletCount: 4,
  totalWeightLbs: 3400,
  freightClass: "Class 70",
};

const sampleQuotes: FreightCarrierQuote[] = [
  {
    id: "quote_fxfe_01",
    carrierName: "FedEx Freight Priority",
    scacCode: "FXFE",
    mode: "LTL",
    transitDays: 2,
    baseRateUsd: 1250.0,
    fuelSurchargeUsd: 180.5,
    accessorialsUsd: 75.0,
    totalLandedCostUsd: 1505.5,
    tenderStatus: "QUOTED",
    guaranteedDelivery: true,
  },
  {
    id: "quote_odfl_02",
    carrierName: "Old Dominion Freight Line",
    scacCode: "ODFL",
    mode: "LTL",
    transitDays: 3,
    baseRateUsd: 1080.0,
    fuelSurchargeUsd: 155.0,
    accessorialsUsd: 50.0,
    totalLandedCostUsd: 1285.0,
    tenderStatus: "QUOTED",
    guaranteedDelivery: false,
  },
];

describe("FreightCarrierRateComparator", () => {
  it("renders lane and carrier details truthfully", () => {
    render(<FreightCarrierRateComparator lane={sampleLane} quotes={sampleQuotes} />);
    expect(screen.getByText(/Freight Lane Quote Comparator/i)).toBeInTheDocument();
    expect(screen.getByText("60666 (Chicago, IL)")).toBeInTheDocument();
    expect(screen.getByText("FedEx Freight Priority")).toBeInTheDocument();
    expect(screen.getByText("Old Dominion Freight Line")).toBeInTheDocument();
    expect(screen.getByText("Lowest Cost")).toBeInTheDocument();
  });

  it("handles awarding a carrier tender", () => {
    const handleAward = vi.fn();
    render(
      <FreightCarrierRateComparator
        lane={sampleLane}
        quotes={sampleQuotes}
        onAwardTender={handleAward}
      />
    );

    const awardButtons = screen.getAllByRole("button", { name: /Award shipment tender to/i });
    expect(awardButtons.length).toBe(2);
    fireEvent.click(awardButtons[1]!);

    expect(handleAward).toHaveBeenCalledWith("quote_odfl_02", "Old Dominion Freight Line");
    expect(screen.getByText("Tender Awarded")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <FreightCarrierRateComparator lane={sampleLane} quotes={sampleQuotes} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
