import type { Meta, StoryObj } from "@storybook/react";
import { DsarRequestLifecycleManager } from "./dsar-request-lifecycle-manager";

const meta: Meta<typeof DsarRequestLifecycleManager> = {
  title: "Platforms/BusinessSuite/LegalOps/DsarRequestLifecycleManager",
  component: DsarRequestLifecycleManager,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DsarRequestLifecycleManager>;

const mockCase = {
  ticketId: "DSAR-2026-EU-4401",
  subjectEmail: "clara.dupont@enterprise-client.fr",
  jurisdiction: "GDPR (EU 2016/679)" as const,
  requestType: "RIGHT_TO_ACCESS" as const,
  submittedDate: "2026-08-25",
  daysRemainingSla: 16,
  currentStage: "SYSTEM_DATA_DISCOVERY" as const,
  discoveredSystems: [
    {
      systemName: "Salesforce CRM Enterprise",
      recordsFound: 48,
      piiCategories: ["First/Last Name", "Work Email", "Phone", "Account Role"],
      status: "SCANNED" as const,
    },
    {
      systemName: "Stripe Billing & Invoicing",
      recordsFound: 12,
      piiCategories: ["Billing Address", "Card Last 4", "Payment History"],
      status: "SCANNED" as const,
    },
    {
      systemName: "PostgreSQL Core Multi-Tenant DB",
      recordsFound: 142,
      piiCategories: ["IP Access Logs", "User Preferences", "Session Tokens"],
      status: "SCANNED" as const,
    },
  ],
};

export const Default: Story = {
  args: {
    caseDetails: mockCase,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    caseDetails: mockCase,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    caseDetails: mockCase,
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>DSAR Lifecycle Workflow & Discovery Grid</h4>
        <DsarRequestLifecycleManager caseDetails={mockCase} density="compact" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Compact Density</h4>
        <DsarRequestLifecycleManager caseDetails={mockCase} density="compact" />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Comfortable Density</h4>
        <DsarRequestLifecycleManager caseDetails={mockCase} density="comfortable" />
      </div>
    </div>
  ),
};
