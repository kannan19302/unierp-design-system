import type { Meta, StoryObj } from "@storybook/react";
import { DsarRequestLifecycleManager } from "./dsar-request-lifecycle-manager";

const meta: Meta<typeof DsarRequestLifecycleManager> = {
  title: "Workflow/DsarRequestLifecycleManager",
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
