import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  SpendCategorySourcingMatrix,
  SpendCategoryItem,
} from "./spend-category-sourcing-matrix";

const sampleCategories: SpendCategoryItem[] = [
  {
    id: "spend_cat_01",
    categoryName: "Cloud Compute & Managed Databases",
    kraljicQuadrant: "STRATEGIC",
    annualSpendUsd: 4200000,
    activeSuppliersCount: 3,
    supplyRiskScore: 78,
    contractExpirationDate: "2026-11-30",
    sourcingStatus: "EXPIRING_SOON",
  },
  {
    id: "spend_cat_02",
    categoryName: "Commercial Freight & Logistics",
    kraljicQuadrant: "LEVERAGE",
    annualSpendUsd: 3800000,
    activeSuppliersCount: 8,
    supplyRiskScore: 35,
    contractExpirationDate: "2026-09-30",
    sourcingStatus: "CONTRACTED",
  },
];

describe("SpendCategorySourcingMatrix", () => {
  it("renders spend categories and portfolio KPI totals truthfully", () => {
    render(<SpendCategorySourcingMatrix categories={sampleCategories} />);
    expect(
      screen.getByText(/Kraljic Portfolio Matrix & Category Procurement Register/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Cloud Compute & Managed Databases")).toBeInTheDocument();
    expect(screen.getByText("Commercial Freight & Logistics")).toBeInTheDocument();
    expect(screen.getByText("1 Strategic Categories")).toBeInTheDocument();
  });

  it("handles filtering by Kraljic quadrant and launching RFP", () => {
    const handleLaunch = vi.fn();
    render(
      <SpendCategorySourcingMatrix
        categories={sampleCategories}
        onLaunchRfp={handleLaunch}
      />
    );

    const filter = screen.getByLabelText(/Filter Quadrant:/i);
    fireEvent.change(filter, { target: { value: "STRATEGIC" } });
    expect(screen.getByText("Cloud Compute & Managed Databases")).toBeInTheDocument();
    expect(screen.queryByText("Commercial Freight & Logistics")).not.toBeInTheDocument();

    const rfpBtn = screen.getByRole("button", {
      name: "Launch RFP for Cloud Compute & Managed Databases",
    });
    fireEvent.click(rfpBtn);
    expect(handleLaunch).toHaveBeenCalledWith("spend_cat_01");
    expect(screen.getByText("RFP Dispatched")).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(<SpendCategorySourcingMatrix categories={sampleCategories} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
