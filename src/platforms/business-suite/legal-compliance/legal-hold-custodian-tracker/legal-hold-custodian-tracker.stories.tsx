import type { Meta, StoryObj } from "@storybook/react";
import {
  LegalHoldCustodianTracker,
  type LegalMatterInfo,
  type LegalHoldCustodian,
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
  title: "Platforms/BusinessSuite/LegalOps/LegalHoldCustodianTracker",
  component: LegalHoldCustodianTracker,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LegalHoldCustodianTracker>;

export const Default: Story = {
  args: {
    matter: sampleMatter,
    custodians: sampleCustodians,
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const Comfortable: Story = {
  args: {
    ...Default.args,
    density: "comfortable",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Legal Hold Custodian Compliance Tracker</h4>
        <LegalHoldCustodianTracker
          matter={sampleMatter}
          custodians={sampleCustodians}
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px", maxWidth: "900px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Active Investigation Roster (Compact)</h4>
        <LegalHoldCustodianTracker
          matter={sampleMatter}
          custodians={sampleCustodians}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Comfortable Density View</h4>
        <LegalHoldCustodianTracker
          matter={sampleMatter}
          custodians={sampleCustodians}
          density="comfortable"
        />
      </div>
    </div>
  ),
};
