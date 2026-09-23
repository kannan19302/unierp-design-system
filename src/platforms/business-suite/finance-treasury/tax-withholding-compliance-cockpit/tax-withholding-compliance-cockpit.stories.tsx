import type { Meta, StoryObj } from "@storybook/react";
import { TaxWithholdingComplianceCockpit } from "./tax-withholding-compliance-cockpit";

const meta: Meta<typeof TaxWithholdingComplianceCockpit> = {
  title: "Platforms/BusinessSuite/FinanceTreasury/TaxWithholdingComplianceCockpit",
  component: TaxWithholdingComplianceCockpit,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TaxWithholdingComplianceCockpit>;

const mockVendors = [
  {
    id: "v_1",
    vendorLegalName: "Beacon Cloud Consulting Inc",
    dbaName: "BeaconOps",
    tinMasked: "••-•••9941",
    formType: "W_9" as const,
    tinStatus: "TIN_MATCHED" as const,
    ytdSpendUsd: 148500,
    withholdingStatus: "NONE" as const,
  },
  {
    id: "v_2",
    vendorLegalName: "Kodiak Security Systems LLC",
    tinMasked: "••-•••1102",
    formType: "W_9" as const,
    tinStatus: "B_NOTICE_ISSUED" as const,
    ytdSpendUsd: 84000,
    withholdingStatus: "ACTIVE_24_PCT" as const,
  },
  {
    id: "v_3",
    vendorLegalName: "Global AI Research Ltd",
    tinMasked: "••-•••5530",
    formType: "W_8BEN_E" as const,
    tinStatus: "EXEMPT" as const,
    ytdSpendUsd: 350000,
    withholdingStatus: "EXEMPT" as const,
  },
  {
    id: "v_4",
    vendorLegalName: "Apex Logistics Courier",
    tinMasked: "••-•••7721",
    formType: "W_9" as const,
    tinStatus: "PENDING_VERIFICATION" as const,
    ytdSpendUsd: 450, // Below $600 threshold
    withholdingStatus: "NONE" as const,
  },
];

export const Default: Story = {
  args: {
    taxYear: 2026,
    vendors: mockVendors,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    taxYear: 2026,
    vendors: mockVendors,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    taxYear: 2026,
    vendors: mockVendors,
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <TaxWithholdingComplianceCockpit {...args} vendors={mockVendors} />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h3 style={{ marginBlockEnd: "0.5rem" }}>Standard Tax Year 2026 View</h3>
        <TaxWithholdingComplianceCockpit vendors={mockVendors} density="standard" />
      </div>
      <div>
        <h3 style={{ marginBlockEnd: "0.5rem" }}>Ultra Compact Density</h3>
        <TaxWithholdingComplianceCockpit vendors={mockVendors} density="ultra-compact" />
      </div>
    </div>
  ),
};
