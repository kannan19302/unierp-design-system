import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MasterDetailSplitNavigator } from "./master-detail-split-navigator";

describe("MasterDetailSplitNavigator", () => {
  it("renders index indicators and handles previous / next navigation", () => {
    const handleNavigate = vi.fn();
    render(
      <MasterDetailSplitNavigator
        currentIndex={5}
        totalCount={20}
        onNavigate={handleNavigate}
      />
    );

    expect(screen.getByText(/of 20/i)).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: /Previous record/i });
    fireEvent.click(prevBtn);
    expect(handleNavigate).toHaveBeenCalledWith(4);

    const nextBtn = screen.getByRole("button", { name: /Next record/i });
    fireEvent.click(nextBtn);
    expect(handleNavigate).toHaveBeenCalledWith(6);
  });

  it("handles split ratio change", () => {
    const handleRatioChange = vi.fn();
    render(
      <MasterDetailSplitNavigator
        currentIndex={1}
        totalCount={10}
        onNavigate={() => {}}
        splitRatio="50/50"
        onSplitRatioChange={handleRatioChange}
      />
    );

    const ratioBtn = screen.getByRole("button", { name: /Split ratio 30 : 70/i });
    fireEvent.click(ratioBtn);
    expect(handleRatioChange).toHaveBeenCalledWith("30/70");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <MasterDetailSplitNavigator
        currentIndex={5}
        totalCount={20}
        onNavigate={() => {}}
        splitRatio="50/50"
        onSplitRatioChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
