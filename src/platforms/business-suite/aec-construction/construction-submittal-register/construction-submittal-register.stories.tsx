import type { Meta, StoryObj } from "@storybook/react";
import {
  ConstructionSubmittalRegister,
  type ConstructionSubmittalItem,
} from "./construction-submittal-register";

const sampleSubmittals: ConstructionSubmittalItem[] = [
  {
    id: "sub_033000_14",
    submittalNumber: "03-3000-014",
    specSection: "03 30 00 Cast-in-Place Concrete",
    title: "Platforms/BusinessSuite/AecConstruction/ConstructionSubmittalRegister",
    subcontractor: "Apex Structural Pours LLC",
    reviewer: "Thornton Tomasetti Structural Engineering",
    status: "APPROVED",
    leadTimeWeeks: 4,
    requiredOnSiteDate: "2026-10-15",
    ballInCourt: "Lead Structural Engineer",
  },
  {
    id: "sub_051200_08",
    submittalNumber: "05-1200-008",
    specSection: "05 12 00 Structural Steel Framing",
    title: "Flange Plate Connection Shop Drawings & Weld Procedures",
    subcontractor: "Schuff Steel Fabrication",
    reviewer: "Arup Engineering",
    status: "PENDING_REVIEW",
    leadTimeWeeks: 6,
    requiredOnSiteDate: "2026-10-28",
    ballInCourt: "Senior Connection Engineer",
  },
  {
    id: "sub_084400_03",
    submittalNumber: "08-4400-003",
    specSection: "08 44 00 Curtain Wall & Glazing",
    title: "Triple-Glazed Unitized Façade Acoustic Performance Data",
    subcontractor: "Permasteelisa North America",
    reviewer: "Enclos Façade Consultants",
    status: "OVERDUE",
    leadTimeWeeks: 12,
    requiredOnSiteDate: "2026-09-15",
    ballInCourt: "Principal Architect",
  },
  {
    id: "sub_262416_02",
    submittalNumber: "26-2416-002",
    specSection: "26 24 16 Panelboards",
    title: "480V 3-Phase Main Distribution Switchboard Submittal",
    subcontractor: "Rosendin Electric",
    reviewer: "Syska Hennessy Group",
    status: "APPROVED_AS_NOTED",
    leadTimeWeeks: 8,
    requiredOnSiteDate: "2026-11-05",
    ballInCourt: "Lead MEP Coordinator",
  },
];

const meta: Meta<typeof ConstructionSubmittalRegister> = {
  title: "Platforms/BusinessSuite/Construction/ConstructionSubmittalRegister",
  component: ConstructionSubmittalRegister,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConstructionSubmittalRegister>;

export const Default: Story = {
  args: {
    submittals: sampleSubmittals,
    projectName: "Hudson Yards Tower IV Construction",
  },
};

export const UltraCompact: Story = {
  args: {
    submittals: sampleSubmittals,
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Master Submittal Register Log</h4>
        <ConstructionSubmittalRegister
          submittals={sampleSubmittals}
          projectName="Hudson Yards Tower IV Construction"
          density="compact"
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Compact Density</h4>
        <ConstructionSubmittalRegister
          submittals={sampleSubmittals}
          projectName="Tower East Infrastructure"
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Ultra-Compact Density</h4>
        <ConstructionSubmittalRegister
          submittals={sampleSubmittals}
          projectName="Tower East Infrastructure"
          density="ultra-compact"
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 8px 0" }}>Comfortable Density</h4>
        <ConstructionSubmittalRegister
          submittals={sampleSubmittals}
          projectName="Tower East Infrastructure"
          density="comfortable"
        />
      </div>
    </div>
  ),
};
