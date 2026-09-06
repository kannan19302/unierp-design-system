import type { Meta, StoryObj } from "@storybook/react";
import {
  FunnelDropoffAnalyzer,
  FunnelStep,
} from "./funnel-dropoff-analyzer";

const mockSteps: FunnelStep[] = [
  {
    id: "step-1",
    stepNumber: 1,
    name: "Enterprise Landing Page View",
    eventKey: "page_view_home",
    count: 125000,
    overallConversionPct: 100.0,
    stepConversionPct: 100.0,
    dropoffCount: 68750,
    dropoffPct: 55.0,
    medianTimeToConvert: "2m 14s",
  },
  {
    id: "step-2",
    stepNumber: 2,
    name: "Free Trial Sign Up",
    eventKey: "auth_signup_completed",
    count: 56250,
    overallConversionPct: 45.0,
    stepConversionPct: 45.0,
    dropoffCount: 22500,
    dropoffPct: 40.0,
    medianTimeToConvert: "14m 30s",
  },
  {
    id: "step-3",
    stepNumber: 3,
    name: "ERP Tenant Organization Provisioned",
    eventKey: "tenant_workspace_created",
    count: 33750,
    overallConversionPct: 27.0,
    stepConversionPct: 60.0,
    dropoffCount: 11812,
    dropoffPct: 35.0,
    medianTimeToConvert: "1.4 hours",
  },
  {
    id: "step-4",
    stepNumber: 4,
    name: "First Chart of Accounts Imported",
    eventKey: "finance_coa_imported",
    count: 21938,
    overallConversionPct: 17.5,
    stepConversionPct: 65.0,
    dropoffCount: 7678,
    dropoffPct: 35.0,
    medianTimeToConvert: "1.2 days",
  },
  {
    id: "step-5",
    stepNumber: 5,
    name: "Production Subscription Activated",
    eventKey: "billing_invoice_paid",
    count: 14260,
    overallConversionPct: 11.4,
    stepConversionPct: 65.0,
    dropoffCount: 0,
    dropoffPct: 0.0,
    medianTimeToConvert: "6.8 days",
  },
];

const meta: Meta<typeof FunnelDropoffAnalyzer> = {
  title: "Data Display/FunnelDropoffAnalyzer",
  component: FunnelDropoffAnalyzer,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FunnelDropoffAnalyzer>;

export const Default: Story = {
  args: {
    steps: mockSteps,
  },
};

export const SelectedStepInspection: Story = {
  args: {
    steps: mockSteps,
    selectedStepId: "step-3",
  },
};

export const UltraCompactDensity: Story = {
  args: {
    steps: mockSteps,
    density: "ultra-compact",
  },
};
