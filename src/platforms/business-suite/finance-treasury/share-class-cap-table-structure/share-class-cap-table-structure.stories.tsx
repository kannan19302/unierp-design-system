import type { Meta, StoryObj } from "@storybook/react";
import { ShareClassCapTableStructure, ShareClassEntry } from "./share-class-cap-table-structure";

const mockShareClasses: ShareClassEntry[] = [
  {
    id: "sc_common",
    className: "Common Stock (Founders & Early Hires)",
    authorizedShares: 10000000,
    issuedShares: 6500000,
    fullyDilutedShares: 6500000,
    issuePriceUsd: 0.001,
    liquidationPref: "COMMON_RESIDUAL",
    seniorityRank: 4,
  },
  {
    id: "sc_options",
    className: "Unallocated Stock Option Pool (ESOP)",
    authorizedShares: 2000000,
    issuedShares: 0,
    fullyDilutedShares: 1500000,
    issuePriceUsd: 0.85,
    liquidationPref: "COMMON_RESIDUAL",
    seniorityRank: 4,
  },
  {
    id: "sc_seed",
    className: "Series Seed Preferred Stock",
    authorizedShares: 2000000,
    issuedShares: 1800000,
    fullyDilutedShares: 1800000,
    issuePriceUsd: 1.25,
    liquidationPref: "1X_NON_PARTICIPATING",
    seniorityRank: 3,
  },
  {
    id: "sc_ser_a",
    className: "Series A Preferred Stock",
    authorizedShares: 3500000,
    issuedShares: 3200000,
    fullyDilutedShares: 3200000,
    issuePriceUsd: 4.85,
    liquidationPref: "1X_NON_PARTICIPATING",
    seniorityRank: 2,
  },
  {
    id: "sc_ser_b",
    className: "Series B Preferred Stock",
    authorizedShares: 4000000,
    issuedShares: 3800000,
    fullyDilutedShares: 3800000,
    issuePriceUsd: 12.5,
    liquidationPref: "1X_PARTICIPATING",
    seniorityRank: 1,
  },
];

const meta: Meta<typeof ShareClassCapTableStructure> = {
  title: "Platforms/BusinessSuite/FinanceTreasury/ShareClassCapTableStructure",
  component: ShareClassCapTableStructure,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShareClassCapTableStructure>;

export const Default: Story = {
  args: {
    companyName: "Acme Global Technologies Inc.",
    shareClasses: mockShareClasses,
    postMoneyValuationUsd: 210000000,
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Default Compact View</h4>
        <ShareClassCapTableStructure
          companyName="Acme Global Technologies Inc."
          shareClasses={mockShareClasses}
          postMoneyValuationUsd={210000000}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Ultra-Compact View</h4>
        <ShareClassCapTableStructure
          companyName="Apex Cloud Labs"
          shareClasses={mockShareClasses}
          postMoneyValuationUsd={150000000}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
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
