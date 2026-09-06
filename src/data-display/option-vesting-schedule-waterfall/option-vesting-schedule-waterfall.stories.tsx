import type { Meta, StoryObj } from "@storybook/react";
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
    status: "exercised",
    percentVested: 25.0,
  },
  {
    id: "tr-2",
    vestDate: "2025-06-01",
    sharesVesting: 3000,
    cumulativeVested: 15000,
    status: "vested",
    percentVested: 31.25,
  },
  {
    id: "tr-3",
    vestDate: "2025-09-01",
    sharesVesting: 3000,
    cumulativeVested: 18000,
    status: "vested",
    percentVested: 37.5,
  },
  {
    id: "tr-4",
    vestDate: "2025-12-01",
    sharesVesting: 3000,
    cumulativeVested: 21000,
    status: "vested",
    percentVested: 43.75,
  },
  {
    id: "tr-5",
    vestDate: "2026-03-01",
    sharesVesting: 3000,
    cumulativeVested: 24000,
    status: "upcoming",
    percentVested: 50.0,
  },
];

const meta: Meta<typeof OptionVestingScheduleWaterfall> = {
  title: "Data Display/OptionVestingScheduleWaterfall",
  component: OptionVestingScheduleWaterfall,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof OptionVestingScheduleWaterfall>;

export const Default: Story = {
  args: {
    grantNumber: "ESOP-2024-042",
    granteeName: "Elena Rostova",
    grantType: "ISO",
    totalGrantedShares: 48000,
    strikePrice: 1.25,
    currentFairMarketValue: 18.5,
    vestingCommencementDate: "2024-03-01",
    cliffDate: "2025-03-01",
    cliffShares: 12000,
    election83bFiled: true,
    tranches: mockTranches,
  },
};

export const UltraCompactDensity: Story = {
  args: {
    grantNumber: "ESOP-2024-042",
    granteeName: "Elena Rostova",
    grantType: "ISO",
    totalGrantedShares: 48000,
    strikePrice: 1.25,
    currentFairMarketValue: 18.5,
    vestingCommencementDate: "2024-03-01",
    cliffDate: "2025-03-01",
    cliffShares: 12000,
    election83bFiled: true,
    tranches: mockTranches,
    density: "ultra-compact",
  },
};
