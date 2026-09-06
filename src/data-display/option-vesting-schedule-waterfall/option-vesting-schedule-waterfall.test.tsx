import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import React from "react";
import {
  OptionVestingScheduleWaterfall,
  VestingTranche,
} from "./option-vesting-schedule-waterfall";

const mockTranches: VestingTranche[] = [
  {
    id: "tr-1",
    vestDate: "2025-03-01",
    sharesVesting: 12000,
    cumulativeVested: 12000,
    status: "vested",
    percentVested: 25.0,
  },
  {
    id: "tr-2",
    vestDate: "2025-06-01",
    sharesVesting: 3000,
    cumulativeVested: 15000,
    status: "upcoming",
    percentVested: 31.25,
  },
];

describe("OptionVestingScheduleWaterfall", () => {
  it("renders grant metadata, vesting valuation, and tranches", () => {
    render(
      <OptionVestingScheduleWaterfall
        grantNumber="ESOP-2024-042"
        granteeName="Elena Rostova"
        grantType="ISO"
        totalGrantedShares={48000}
        strikePrice={1.25}
        currentFairMarketValue={18.5}
        vestingCommencementDate="2024-03-01"
        cliffDate="2025-03-01"
        cliffShares={12000}
        election83bFiled={true}
        tranches={mockTranches}
      />
    );
    expect(
      screen.getByText("Equity Option Vesting Waterfall: Elena Rostova")
    ).toBeInTheDocument();
    expect(screen.getByText("ESOP-2024-042")).toBeInTheDocument();
    expect(screen.getByText("✓ 83(b) Election Filed")).toBeInTheDocument();
    expect(screen.getByText("2025-03-01")).toBeInTheDocument();
  });

  it("handles exercise vested shares button click", () => {
    const onExercise = vi.fn();
    render(
      <OptionVestingScheduleWaterfall
        grantNumber="ESOP-2024-042"
        granteeName="Elena Rostova"
        grantType="ISO"
        totalGrantedShares={48000}
        strikePrice={1.25}
        currentFairMarketValue={18.5}
        vestingCommencementDate="2024-03-01"
        cliffDate="2025-03-01"
        cliffShares={12000}
        election83bFiled={true}
        tranches={mockTranches}
        onExerciseVestedShares={onExercise}
      />
    );

    const exerciseBtn = screen.getByRole("button", {
      name: /Exercise Vested Shares/i,
    });
    fireEvent.click(exerciseBtn);
    expect(onExercise).toHaveBeenCalledWith("ESOP-2024-042", 12000);
  });

  it("passes automated accessibility (axe) checks", async () => {
    const { container } = render(
      <OptionVestingScheduleWaterfall
        grantNumber="ESOP-2024-042"
        granteeName="Elena Rostova"
        grantType="ISO"
        totalGrantedShares={48000}
        strikePrice={1.25}
        currentFairMarketValue={18.5}
        vestingCommencementDate="2024-03-01"
        cliffDate="2025-03-01"
        cliffShares={12000}
        election83bFiled={true}
        tranches={mockTranches}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
