import type { Meta, StoryObj } from "@storybook/react";
import { DualControlModal } from "./dual-control-modal";

const meta: Meta<typeof DualControlModal> = {
  title: "Overlays/DualControlModal",
  component: DualControlModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    riskLevel: {
      control: "select",
      options: ["critical", "high", "moderate"],
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof DualControlModal>;

export const WireTransferApproval: Story = {
  args: {
    open: true,
    operationTitle: "Authorize Outbound Wire Transfer $2,450,000.00 USD",
    operationType: "WIRE_TRANSFER_AUTHORIZATION",
    riskLevel: "critical",
    targetEntity: "Treasury Acct #8849-JP-MORGAN-US",
    initiatorName: "Sarah Jenkins",
    initiatorRole: "Treasury Operations Analyst",
    sha256Fingerprint: "a9f8e4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5",
    complianceStandard: "SOX-404 / SOC2 Dual Signoff Mandate",
    density: "compact",
    onClose: () => {},
    onAuthorize: () => {},
  },
};

export const LedgerPeriodCloseOverride: Story = {
  args: {
    open: true,
    operationTitle: "Override Hard Lock on FY2026-Q2 General Ledger",
    operationType: "LEDGER_LOCK_OVERRIDE",
    riskLevel: "high",
    targetEntity: "UniERP Consolidated Corp (Entity #001)",
    initiatorName: "Marcus Vance",
    initiatorRole: "Senior Financial Controller",
    sha256Fingerprint: "7c5a2b1d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    complianceStandard: "IFRS / US-GAAP Period Closing Governance",
    density: "standard",
    onClose: () => {},
    onAuthorize: () => {},
  },
};

export const KeyringRotationOverride: Story = {
  args: {
    open: true,
    operationTitle: "Emergency HSM Keyring Revocation & Rotation",
    operationType: "KMS_EMERGENCY_ROTATION",
    riskLevel: "critical",
    targetEntity: "Vault KMS Cluster us-east-1 (Primary Keyring)",
    initiatorName: "Alex Rivera",
    initiatorRole: "Lead Platform Security Architect",
    sha256Fingerprint: "1f8e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0f1e",
    complianceStandard: "PCI-DSS 4.0 / FedRAMP High HSM Policy",
    density: "ultra-compact",
    onClose: () => {},
    onAuthorize: () => {},
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ position: "relative", minHeight: "500px", width: "100%" }}>
      <DualControlModal
        open={true}
        operationTitle="Reconcile Sovereign Bond Liquidity Pool"
        operationType="SOVEREIGN_TREASURY_SETTLEMENT"
        riskLevel="critical"
        targetEntity="Federal Reserve Account #4029-NY"
        initiatorName="Elena Rostova"
        initiatorRole="Chief Investment Officer"
        sha256Fingerprint="3b9a1c8f2e4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b"
        complianceStandard="Basel III Liquidity Framework"
        density="compact"
        onClose={() => {}}
        onAuthorize={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div style={{ position: "relative", minHeight: "450px" }}>
        <h4 style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)", margin: "0 0 var(--space-2) 0" }}>
          Critical Tier (Wire Transfer)
        </h4>
        <DualControlModal
          open={true}
          operationTitle="Transfer $10,000,000 to Apex Clearing"
          operationType="HIGH_VALUE_WIRE"
          riskLevel="critical"
          targetEntity="Apex Escrow Tier-1"
          initiatorName="David Kim"
          initiatorRole="Treasury Director"
          density="compact"
          onClose={() => {}}
          onAuthorize={() => {}}
        />
      </div>
    </div>
  ),
};
