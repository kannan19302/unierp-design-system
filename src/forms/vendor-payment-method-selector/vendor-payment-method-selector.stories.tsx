import type { Meta, StoryObj } from "@storybook/react";
import { VendorPaymentMethodSelector } from "./vendor-payment-method-selector";

const meta: Meta<typeof VendorPaymentMethodSelector> = {
  title: "Forms/VendorPaymentMethodSelector",
  component: VendorPaymentMethodSelector,
  parameters: {
    layout: "padded",
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
