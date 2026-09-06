import type { Meta, StoryObj } from "@storybook/react";
import { RfiSubmissionWorkflow } from "./rfi-submission-workflow";

const meta: Meta<typeof RfiSubmissionWorkflow> = {
  title: "Workflow/RfiSubmissionWorkflow",
  component: RfiSubmissionWorkflow,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RfiSubmissionWorkflow>;

const sampleAttachments = [
  {
    id: "att-1",
    name: "Drawing-S-402-Column-Baseplate-Details.pdf",
    sizeBytes: 3450000,
    type: "PDF",
  },
  {
    id: "att-2",
    name: "Site-Photo-Gridline-C4-Slab-Pour.jpg",
    sizeBytes: 1820000,
    type: "JPG",
  },
];

const sampleActivity = [
  {
    id: "act-1",
    author: "Dave Vance",
    role: "Project Superintendent",
    timestamp: "2026-09-02 08:30 AM",
    action: "Initiated RFI and logged foundation bolt alignment conflict",
    comment: "Found bolts offset by 2.25 inches toward north face compared to steel fabricator shop drawing.",
  },
  {
    id: "act-2",
    author: "Sarah Chen",
    role: "Structural Project Manager",
    timestamp: "2026-09-03 11:15 AM",
    action: "Assigned reviewer Thornton Tomasetti (EOR)",
  },
];

export const InReview: Story = {
  args: {
    rfiNumber: "RFI-2026-089",
    projectTitle: "Hudson Yards Tower C Commercial Core",
    discipline: "Structural Steel",
    subject: "Discrepancy between Grid line C-4 foundation slab anchor bolts and shop drawing S-402",
    questionDetails:
      "Anchor bolt layout on foundation pier C-4 exhibits a 2.25-inch north deviation from drawing S-402. Column steel delivery is scheduled for Tuesday. Confirm if slotted hole baseplate modification or epoxied dowel replacement is approved.",
    proposedSolution: "Fabricate 1.5-inch thicker adaptor baseplate with enlarged slots on C-4 to avoid pier re-drilling.",
    assignedReviewer: "Thornton Tomasetti (Lead Structural EOR)",
    coordinatingContractor: "Turner Construction / NYC Steel",
    costImpactEstimate: 14500,
    scheduleImpactDays: 3,
    status: "in_review",
    attachments: sampleAttachments,
    activityLog: sampleActivity,
    density: "compact",
  },
};

export const Answered: Story = {
  args: {
    ...InReview.args,
    status: "answered",
    officialResponse:
      "Option 1 approved with conditions: Enlarge baseplate slots per revised engineering detail SK-104 attached. Ultrasonic testing required for anchor embedment prior to steel erection. Cost impact acknowledged.",
    responseAuthor: "Elena Rostova, PE (Thornton Tomasetti)",
    responseDate: "2026-09-04",
  },
};

export const Closed: Story = {
  args: {
    ...Answered.args,
    status: "closed",
  },
};
