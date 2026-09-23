import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalSignatureForm } from "./approval-signature-form";

const meta: Meta<typeof ApprovalSignatureForm> = {
  title: "Core/Forms/ApprovalSignatureForm",
  component: ApprovalSignatureForm,
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
    signerName: {
      control: "text",
      description: "Identity of operator authorizing transaction",
    },
    documentTitle: {
      control: "text",
      description: "Subject title of document undergoing signature",
    },
    documentRef: {
      control: "text",
      description: "Immutable ledger reference / hash",
    },
    onSign: {
      action: "documentSigned",
      description: "Callback invoked upon valid electronic signature",
    },
    onReject: {
      action: "documentRejected",
      description: "Callback invoked upon document rejection with reason",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ApprovalSignatureForm>;

export const Default: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)" }}>
      <ApprovalSignatureForm
        signerName="John Smith (CFO)"
        documentTitle="Purchase Order #PO-2026-0891"
        documentRef="DOC-TX-998824-2026"
      />
    </div>
  ),
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "36rem", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h4>Anatomy and Composition</h4>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)" }}>
        ApprovalSignatureForm binds transaction identity, signer role, mandatory consent checkboxes,
        and dual-path approval or rejection reasoning.
      </p>
      <ApprovalSignatureForm
        signerName="Elena Rostova (Compliance Lead)"
        documentTitle="Treasury Wire Transfer $2,500,000"
        documentRef="WIRE-FX-2026-551"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "38rem", display: "flex", flexDirection: "column", gap: "var(--space-8)", padding: "var(--space-4)" }}>
      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>Initial Pending Signature State</h5>
        <ApprovalSignatureForm
          signerName="Dr. Marcus Vance (VP Procurement)"
          documentTitle="Master Vendor Agreement - Heavy Equipment"
        />
      </div>

      <div>
        <h5 style={{ marginBlockEnd: "var(--space-2)" }}>High-Value Dual Control Mandate</h5>
        <ApprovalSignatureForm
          title="Dual Custody Signature Required"
          subtitle="Tier 4 corporate sign-off requires primary signer consent and cryptographic audit log."
          signerName="Sarah Connor (Treasury Director)"
          documentTitle="Credit Facility Amendment #FA-902"
          documentRef="FA-902-SEC"
        />
      </div>
    </div>
  ),
};
