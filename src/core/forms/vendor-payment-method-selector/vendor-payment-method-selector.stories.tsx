import type { Meta, StoryObj } from "@storybook/react";
import { VendorPaymentMethodSelector } from "./vendor-payment-method-selector";

const meta: Meta<typeof VendorPaymentMethodSelector> = {
  title: "Forms/VendorPaymentMethodSelector",
  component: VendorPaymentMethodSelector,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VendorPaymentMethodSelector>;

export const DefaultACH: Story = {
  args: {
    vendorName: "Apex Industrial Automation LLC",
    vendorTaxId: "XX-XXX4910",
    w9Status: "verified",
    initialRail: "ACH",
    initialDetails: {
      routingNumber: "021000021",
      accountNumber: "884019284",
      accountType: "checking",
    },
    density: "compact",
  },
};

export const VirtualCardRebate: Story = {
  args: {
    ...DefaultACH.args,
    initialRail: "CARD",
    initialDetails: {
      remittanceEmail: "ar-billing@apexautomation.com",
    },
  },
};

export const SwiftWire: Story = {
  args: {
    vendorName: "Kuka Robotics GmbH",
    vendorTaxId: "DE-8114092",
    w9Status: "verified",
    initialRail: "WIRE",
    initialDetails: {
      swiftBic: "CHASUS33XXX",
      beneficiaryBankName: "JPMorgan Chase Bank, N.A.",
      iban: "US49CHAS021000021884019284",
    },
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: 800, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <VendorPaymentMethodSelector
        vendorName="Siemens AG Industrial Systems"
        vendorTaxId="DE-129274202"
        w9Status="verified"
        initialRail="SEPA"
        initialDetails={{
          iban: "DE89370400440532013000",
          swiftBic: "DEUTDEDBFXX",
        }}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: 800, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Pending W-9 Compliance Review
        </h4>
        <VendorPaymentMethodSelector
          vendorName="Unverified Freelance Contractor"
          vendorTaxId="XX-XXX1122"
          w9Status="pending"
          initialRail="ACH"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", color: "var(--color-text-secondary)" }}>
          Commercial Card with Rebate
        </h4>
        <VendorPaymentMethodSelector
          vendorName="FastTrack Logistics Global"
          vendorTaxId="XX-XXX8899"
          w9Status="verified"
          initialRail="CARD"
          initialDetails={{
            remittanceEmail: "disbursements@fasttrack.com",
          }}
        />
      </div>
    </div>
  ),
};
