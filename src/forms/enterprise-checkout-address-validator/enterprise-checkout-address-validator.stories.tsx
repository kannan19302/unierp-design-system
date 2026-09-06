import type { Meta, StoryObj } from "@storybook/react";
import {
  EnterpriseCheckoutAddressValidator,
  PostalAddress,
  StandardizedAddressSuggestion,
} from "./enterprise-checkout-address-validator";

const sampleAddress: PostalAddress = {
  companyName: "Acme Global Distribution LLC",
  attentionName: "Marcus Vance",
  street1: "742 Evergreen Terrace",
  street2: "Suite 100",
  city: "Springfield",
  state: "IL",
  postalCode: "62704",
  country: "United States",
};

const sampleSuggestion: StandardizedAddressSuggestion = {
  companyName: "Acme Global Distribution LLC",
  attentionName: "Marcus Vance",
  street1: "742 Evergreen Terrace",
  street2: "Suite 100",
  standardizedStreet1: "742 EVERGREEN TER",
  standardizedStreet2: "STE 100",
  city: "SPRINGFIELD",
  state: "IL",
  postalCode: "62704",
  standardizedPostalCode: "62704-1234",
  country: "United States",
  dpvConfirmed: true,
  isCommercial: true,
  carrierRoute: "C012",
};

const meta: Meta<typeof EnterpriseCheckoutAddressValidator> = {
  title: "Forms/EnterpriseCheckoutAddressValidator",
  component: EnterpriseCheckoutAddressValidator,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof EnterpriseCheckoutAddressValidator>;

export const Default: Story = {
  args: {
    initialAddress: sampleAddress,
    mockSuggestion: sampleSuggestion,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
