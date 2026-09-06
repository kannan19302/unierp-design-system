import type { Meta, StoryObj } from "@storybook/react";
import { StageProgressionBar, type StageItem } from "./stage-progression-bar";

const salesStages: StageItem[] = [
  { id: "lead", label: "Lead Ingestion", status: "completed", duration: "1 day" },
  { id: "qual", label: "Qualified", status: "completed", duration: "3 days" },
  { id: "opp", label: "Opportunity", status: "current", duration: "5 days active" },
  { id: "prop", label: "Proposal & Quote", status: "upcoming" },
  { id: "neg", label: "Negotiation", status: "upcoming" },
  { id: "closed", label: "Closed / Won", status: "upcoming" },
];

const procurementStages: StageItem[] = [
  { id: "req", label: "Requisition", status: "completed", duration: "Instant" },
  { id: "approval", label: "Multi-Tier Approval", status: "completed", duration: "4 hours" },
  { id: "po", label: "PO Dispatch", status: "completed", duration: "1 day" },
  { id: "grn", label: "Goods Receipt", status: "current", duration: "2 days awaiting dock" },
  { id: "inv", label: "3-Way Match", status: "upcoming" },
  { id: "pay", label: "Disbursement", status: "upcoming" },
];

const blockedStages: StageItem[] = [
  { id: "s1", label: "Identity Verified", status: "completed" },
  { id: "s2", label: "Credit Review", status: "completed" },
  { id: "s3", label: "KYC Sanction Audit", status: "exception", duration: "PEP Alert Triggered" },
  { id: "s4", label: "Account Onboarding", status: "blocked" },
];

const meta: Meta<typeof StageProgressionBar> = {
  title: "Workflow/StageProgressionBar",
  component: StageProgressionBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StageProgressionBar>;

export const SalesOpportunityLifecycle: Story = {
  args: {
    stages: salesStages,
    currentStageId: "opp",
    showAdvanceButton: true,
    advanceButtonLabel: "Advance to Proposal",
    density: "compact",
  },
};

export const ProcureToPayPipeline: Story = {
  args: {
    stages: procurementStages,
    currentStageId: "grn",
    showAdvanceButton: true,
    advanceButtonLabel: "Confirm Goods Receipt",
    density: "compact",
  },
};

export const ComplianceExceptionState: Story = {
  args: {
    stages: blockedStages,
    currentStageId: "s3",
    density: "compact",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    stages: salesStages,
    currentStageId: "opp",
    density: "ultra-compact",
  },
};
