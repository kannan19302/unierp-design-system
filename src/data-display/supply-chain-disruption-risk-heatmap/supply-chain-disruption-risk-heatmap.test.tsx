import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  SupplyChainDisruptionRiskHeatmap,
  LaneRiskCell,
} from "./supply-chain-disruption-risk-heatmap";

const sampleOrigins = ["Shanghai (CNSHA)", "Ningbo (CNNGB)"];
const sampleDestinations = ["Long Beach (USLGB)", "Rotterdam (NLRTM)"];

const sampleCells: LaneRiskCell[] = [
  {
    laneId: "LANE-TP-01",
    originHub: "Shanghai (CNSHA)",
    destinationHub: "Long Beach (USLGB)",
    riskScore: 88,
    severity: "critical",
    category: "port_congestion",
    dwellDays: 7.4,
    transitVarianceDays: 3.8,
    recommendedAlternate: "Divert via Prince Rupert (CAPRR)",
    primaryCarrier: "Maersk Line",
  },
  {
    laneId: "LANE-EU-02",
    originHub: "Shanghai (CNSHA)",
    destinationHub: "Rotterdam (NLRTM)",
    riskScore: 62,
    severity: "elevated",
    category: "geopolitical",
    dwellDays: 4.2,
    transitVarianceDays: 1.5,
    primaryCarrier: "CMA CGM",
  },
];

describe("SupplyChainDisruptionRiskHeatmap", () => {
  it("renders table headers, matrix cells and inspector drawer", () => {
    render(
      <SupplyChainDisruptionRiskHeatmap
        origins={sampleOrigins}
        destinations={sampleDestinations}
        cells={sampleCells}
      />
    );

    expect(screen.getByText("Shanghai (CNSHA)")).toBeDefined();
    expect(screen.getByText("Long Beach (USLGB)")).toBeDefined();
    expect(screen.getByText("88")).toBeDefined();
    expect(screen.getByText("Divert via Prince Rupert (CAPRR)")).toBeDefined();
  });

  it("selects another cell and updates the inspector drawer", () => {
    const handleSelect = vi.fn();

    render(
      <SupplyChainDisruptionRiskHeatmap
        origins={sampleOrigins}
        destinations={sampleDestinations}
        cells={sampleCells}
        onSelectLane={handleSelect}
      />
    );

    const cellBtn = screen.getByRole("button", {
      name: /Lane Shanghai \(CNSHA\) to Rotterdam \(NLRTM\)/i,
    });
    fireEvent.click(cellBtn);

    expect(handleSelect).toHaveBeenCalledWith(sampleCells[1]);
    expect(screen.getByText("CMA CGM")).toBeDefined();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <SupplyChainDisruptionRiskHeatmap
        origins={sampleOrigins}
        destinations={sampleDestinations}
        cells={sampleCells}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
