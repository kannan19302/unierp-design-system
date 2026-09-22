import type { Meta, StoryObj } from "@storybook/react";
import { ConditionalFieldGroup } from "./conditional-field-group";

const meta: Meta<typeof ConditionalFieldGroup> = {
  title: "Forms/ConditionalFieldGroup",
  component: ConditionalFieldGroup,
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
    triggerLabel: {
      control: "text",
      description: "Label for the master selection trigger",
    },
    triggerOptions: {
      description: "Available choices displayed in the select dropdown",
    },
    groups: {
      description: "Map of option values to conditionally rendered sub-forms",
    },
    onChange: {
      action: "optionChanged",
      description: "Callback invoked when discriminant selection changes",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConditionalFieldGroup>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)" }}>
      <ConditionalFieldGroup
        triggerLabel="Payment Method"
        triggerOptions={["Wire Transfer", "Corporate Card", "Automated Clearing House (ACH)"]}
        groups={{
          "Wire Transfer": (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <strong>SWIFT / IBAN Details</strong>
              <input placeholder="SWIFT Code" style={{ padding: "var(--space-2)" }} />
              <input placeholder="IBAN Number" style={{ padding: "var(--space-2)" }} />
            </div>
          ),
          "Corporate Card": (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <strong>Commercial Card Authorization</strong>
              <input placeholder="Card Number" style={{ padding: "var(--space-2)" }} />
              <input placeholder="Cardholder Name" style={{ padding: "var(--space-2)" }} />
            </div>
          ),
          "Automated Clearing House (ACH)": (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <strong>Domestic Clearing</strong>
              <input placeholder="Routing Transit Number" style={{ padding: "var(--space-2)" }} />
              <input placeholder="Direct Deposit Account" style={{ padding: "var(--space-2)" }} />
            </div>
          ),
        }}
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        ConditionalFieldGroup acts as a form router, maintaining ARIA role semantics and smooth transitions
        as complex dependent sub-sections switch context.
      </p>
      <ConditionalFieldGroup
        triggerLabel="Tax Residency Classification"
        triggerOptions={["Domestic Entity (W-9)", "Foreign Corp (W-8BEN-E)", "Exempt Sovereign"]}
        defaultOption="Domestic Entity (W-9)"
        groups={{
          "Domestic Entity (W-9)": <div>Federal Employer Identification Number (FEIN) Required</div>,
          "Foreign Corp (W-8BEN-E)": <div>Foreign Tax Identification Number & Chapter 4 Status</div>,
          "Exempt Sovereign": <div>Treaty Article & Diplomatic Immunity Attestation</div>,
        }}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Unselected Initial State</h5>
        <ConditionalFieldGroup
          triggerLabel="Vendor Classification"
          triggerOptions={["Manufacturer", "Distributor", "Service Contractor"]}
          groups={{
            Manufacturer: <div>Factory ISO Certification & OSHA Compliance</div>,
            Distributor: <div>Warehouse Capacity & Freight Forwarder License</div>,
            "Service Contractor": <div>Professional Indemnity Insurance Policy #</div>,
          }}
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Active Child Sub-Form Mounted</h5>
        <ConditionalFieldGroup
          triggerLabel="Vendor Classification"
          triggerOptions={["Manufacturer", "Distributor", "Service Contractor"]}
          defaultOption="Manufacturer"
          groups={{
            Manufacturer: <div>Factory ISO Certification & OSHA Compliance</div>,
            Distributor: <div>Warehouse Capacity & Freight Forwarder License</div>,
            "Service Contractor": <div>Professional Indemnity Insurance Policy #</div>,
          }}
        />
      </div>
    </div>
  ),
};
