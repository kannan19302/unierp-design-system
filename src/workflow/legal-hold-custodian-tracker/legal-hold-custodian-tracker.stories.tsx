import type { Meta, StoryObj } from "@storybook/react";
import {
  LegalHoldCustodianTracker,
  LegalMatterInfo,
  LegalHoldCustodian,
} from "./legal-hold-custodian-tracker";

const sampleMatter: LegalMatterInfo = {
  matterNumber: "MAT-2026-881",
  matterName: "FTC Regulatory Inquiry & Civil Investigative Demand",
  issuingCounsel: "Cravath, Swaine & Moore LLP",
  effectiveDate: "2026-03-01",
};

const sampleCustodians: LegalHoldCustodian[] = [
  {
    id: "cust_01",
    name: "Dr. Julian Vance",
    department: "Product Engineering & Architecture",
    email: "jvance@enterprise.com",
    acknowledgmentStatus: "ACKNOWLEDGED",
    acknowledgedAt: "2026-03-02 09:14 EST",
    dataSourcesPreserved: ["Exchange Online", "OneDrive", "Slack Workspace", "GitHub Enterprise"],
    silentPreservationActive: true,
  },
  {
    id: "cust_02",
    name: "Rachel Montgomery",
    department: "Global Sales & Strategic Pricing",
    email: "rmontgomery@enterprise.com",
    acknowledgmentStatus: "PENDING",
    dataSourcesPreserved: ["Exchange Online", "Salesforce CRM", "Slack Workspace"],
    silentPreservationActive: true,
  },
  {
    id: "cust_03",
    name: "Derek Hayes",
    department: "Corporate Mergers & Acquisitions",
    email: "dhayes@enterprise.com",
    acknowledgmentStatus: "ESCALATED",
    dataSourcesPreserved: ["Exchange Online", "SharePoint VDR", "Google Drive"],
    silentPreservationActive: true,
  },
  {
    id: "cust_04",
    name: "Sophia Martinez",
    department: "External Contractor - Former Lead Architect",
    email: "smartinez-ext@enterprise.com",
    acknowledgmentStatus: "RELEASED",
    acknowledgedAt: "2026-03-01 11:30 EST",
    dataSourcesPreserved: ["Exchange Archive (Retained 7yr)"],
    silentPreservationActive: false,
  },
];

const meta: Meta<typeof LegalHoldCustodianTracker> = {
  title: "Workflow/LegalHoldCustodianTracker",
  component: LegalHoldCustodianTracker,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof LegalHoldCustodianTracker>;

export const Default: Story = {
  args: {
    matter: sampleMatter,
    custodians: sampleCustodians,
  },
};

export const UltraCompact: Story = {
  args: {
    matter: sampleMatter,
    custodians: sampleCustodians,
    density: "ultra-compact",
  },
};
