import type { Meta, StoryObj } from "@storybook/react";
import { CrossFilterFacetPanel } from "./cross-filter-facet-panel";

const SAMPLE_CATEGORIES = [
  {
    id: "region",
    name: "Billing Region",
    options: [
      { id: "reg-na", label: "North America (US/CA)", count: 4820 },
      { id: "reg-emea", label: "Europe & Middle East", count: 3210 },
      { id: "reg-apac", label: "Asia Pacific (SG/JP/IN)", count: 2190 },
      { id: "reg-latam", label: "Latin America", count: 740 },
    ],
  },
  {
    id: "tier",
    name: "Tenant Tier",
    options: [
      { id: "tier-enterprise", label: "Enterprise Sovereign", count: 540 },
      { id: "tier-midmarket", label: "Mid-Market Pro", count: 2450 },
      { id: "tier-starter", label: "Self-Service Starter", count: 7980 },
    ],
  },
  {
    id: "compliance",
    name: "Audit & Compliance",
    options: [
      { id: "comp-soc2", label: "SOC 2 Type II", count: 8650 },
      { id: "comp-iso27001", label: "ISO 27001:2022", count: 6420 },
      { id: "comp-hipaa", label: "HIPAA Compliant", count: 1840 },
      { id: "comp-fedramp", label: "FedRAMP Moderate", count: 320 },
    ],
  },
];

const meta: Meta<typeof CrossFilterFacetPanel> = {
  title: "DataGrid/CrossFilterFacetPanel",
  component: CrossFilterFacetPanel,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CrossFilterFacetPanel>;

export const Default: Story = {
  args: {
    title: "Filter Records",
    categories: SAMPLE_CATEGORIES,
    selectedIds: ["reg-na", "tier-enterprise"],
  },
};

export const EmptySelection: Story = {
  args: {
    title: "Filter Records",
    categories: SAMPLE_CATEGORIES,
    selectedIds: [],
  },
};
