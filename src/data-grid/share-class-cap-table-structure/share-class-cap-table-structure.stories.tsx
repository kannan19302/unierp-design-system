import type { Meta, StoryObj } from "@storybook/react";
import { ShareClassCapTableStructure } from "./share-class-cap-table-structure";

const meta: Meta<typeof ShareClassCapTableStructure> = {
  title: "DataGrid/ShareClassCapTableStructure",
  component: ShareClassCapTableStructure,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShareClassCapTableStructure>;

const mockShareClasses = [
  {
    id: "sc_common",
    className: "Common Stock (Founders & Early Hires)",
    authorizedShares: 10000000,
    issuedShares: 6500000,
    fullyDilutedShares: 6500000,
    issuePriceUsd: 0.001,
    liquidationPref: "COMMON_RESIDUAL" as const,
    seniorityRank: 4,
  },
  {
    id: "sc_options",
    className: "Unallocated Stock Option Pool (ESOP)",
    authorizedShares: 2000000,
    issuedShares: 0,
    fullyDilutedShares: 1500000,
    issuePriceUsd: 0.85,
    liquidationPref: "COMMON_RESIDUAL" as const,
    seniorityRank: 4,
  },
  {
    id: "sc_seed",
    className: "Series Seed Preferred Stock",
    authorizedShares: 2000000,
    issuedShares: 1800000,
    fullyDilutedShares: 1800000,
    issuePriceUsd: 1.25,
    liquidationPref: "1X_NON_PARTICIPATING" as const,
    seniorityRank: 3,
  },
  {
    id: "sc_ser_a",
    className: "Series A Preferred Stock",
    authorizedShares: 3500000,
    issuedShares: 3200000,
    fullyDilutedShares: 3200000,
    issuePriceUsd: 4.85,
    liquidationPref: "1X_NON_PARTICIPATING" as const,
    seniorityRank: 2,
  },
  {
    id: "sc_ser_b",
    className: "Series B Preferred Stock",
    authorizedShares: 4000000,
    issuedShares: 3800000,
    fullyDilutedShares: 3800000,
    issuePriceUsd: 12.5,
    liquidationPref: "1X_PARTICIPATING" as const,
    seniorityRank: 1,
  },
];

export const Default: Story = {
  args: {
    companyName: "Acme Global Technologies Inc.",
    shareClasses: mockShareClasses,
    postMoneyValuationUsd: 210000000,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    companyName: "Apex Cloud Labs",
    shareClasses: mockShareClasses,
    postMoneyValuationUsd: 150000000,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    companyName: "HyperScale AI Corp",
    shareClasses: mockShareClasses,
    postMoneyValuationUsd: 500000000,
    density: "comfortable",
  },
};
