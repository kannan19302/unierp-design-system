import type { Meta, StoryObj } from "@storybook/react";
import { AddressAutoCompleteForm } from "./address-auto-complete-form";

const meta: Meta<typeof AddressAutoCompleteForm> = {
  title: "Core/Forms/AddressAutoCompleteForm",
  component: AddressAutoCompleteForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "label", enabled: true }],
      },
    },
  },
  argTypes: {
    defaultCountry: {
      control: { type: "select" },
      options: ["US", "CA", "GB", "DE", "FR", "IN", "AU", "SG", "JP"],
      description: "Default fallback country selection",
    },
    title: {
      control: "text",
      description: "Form card header title",
    },
    subtitle: {
      control: "text",
      description: "Optional explanatory subtitle under title",
    },
    onSubmit: {
      action: "addressSubmitted",
      description: "Callback invoked when valid address is saved",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AddressAutoCompleteForm>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)" }}>
      <AddressAutoCompleteForm
        defaultCountry="US"
        title="Primary Shipping Destination"
        subtitle="Used as the default delivery target for physical purchase orders."
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        AddressAutoCompleteForm delivers accessible form controls (inter-connected labels, semantic inputs,
        and localized region selectors) structured in an adaptive enterprise grid.
      </p>
      <AddressAutoCompleteForm
        defaultCountry="US"
        initialAddress={{
          line1: "500 Oracle Parkway",
          city: "Redwood City",
          state: "CA",
          postalCode: "94065",
          country: "US",
        }}
        suggestions={[
          "500 Oracle Pkwy, Redwood City, CA 94065",
          "500 Oracle Way, Austin, TX 78741",
        ]}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Empty Initial State</h5>
        <AddressAutoCompleteForm
          title="Billing Address"
          defaultCountry="US"
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Pre-populated International Address (Germany)</h5>
        <AddressAutoCompleteForm
          title="European Warehouse Logistics"
          defaultCountry="DE"
          initialAddress={{
            line1: "Willy-Brandt-Straße 1",
            city: "Berlin",
            state: "Berlin",
            postalCode: "10557",
            country: "DE",
          }}
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>With Typeahead Suggestions Active</h5>
        <AddressAutoCompleteForm
          title="Direct Fulfillment Center"
          defaultCountry="CA"
          initialAddress={{
            line1: "100 King St",
            city: "Toronto",
            state: "ON",
            postalCode: "M5X 1A9",
            country: "CA",
          }}
          suggestions={[
            "100 King Street West, Toronto, ON M5X 1A9",
            "100 King Street East, Hamilton, ON L8N 1A6",
          ]}
        />
      </div>
    </div>
  ),
};
