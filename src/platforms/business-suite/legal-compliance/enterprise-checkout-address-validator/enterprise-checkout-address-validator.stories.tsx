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
  title: "Platforms/BusinessSuite/LegalCompliance/EnterpriseCheckoutAddressValidator",
  component: EnterpriseCheckoutAddressValidator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [{ id: "label", enabled: true }],
      },
    },
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Density scale token",
    },
    initialAddress: {
      description: "Starting postal address state",
    },
    mockSuggestion: {
      description: "USPS/CASS standardized address comparison fixture",
    },
    onConfirmAddress: {
      action: "addressConfirmed",
      description: "Callback invoked when standardized or entered address is accepted",
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "50rem", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        EnterpriseCheckoutAddressValidator couples carrier normalization (CASS / DPV),
        side-by-side comparison between entered and standardized addresses, and commercial routing metadata.
      </p>
      <EnterpriseCheckoutAddressValidator
        initialAddress={sampleAddress}
        mockSuggestion={sampleSuggestion}
        density="compact"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "52rem", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Initial Input Mode (Standard Density)</h5>
        <EnterpriseCheckoutAddressValidator
          initialAddress={sampleAddress}
          density="standard"
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Comfortable Mode for Warehouse Kiosks</h5>
        <EnterpriseCheckoutAddressValidator
          initialAddress={{
            companyName: "Global Logistics Hub #4",
            attentionName: "Dock Master",
            street1: "1200 Logistics Blvd",
            city: "Memphis",
            state: "TN",
            postalCode: "38118",
            country: "United States",
          }}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
