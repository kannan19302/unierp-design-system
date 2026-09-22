import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FacetedFilterNavigationRail } from "./faceted-filter-navigation-rail";

const meta: Meta<typeof FacetedFilterNavigationRail> = {
  title: "Navigation/FacetedFilterNavigationRail",
  component: FacetedFilterNavigationRail,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof FacetedFilterNavigationRail>;

const sampleGroups = [
  {
    id: "status",
    title: "Document Status",
    options: [
      { id: "opt-pending", label: "Pending Approval", count: 42 },
      { id: "opt-approved", label: "Approved / Cleared", count: 1240 },
      { id: "opt-disputed", label: "Disputed / On Hold", count: 8 },
    ],
  },
  {
    id: "currency",
    title: "Currency",
    options: [
      { id: "curr-usd", label: "USD ($)", count: 840 },
      { id: "curr-eur", label: "EUR (€)", count: 312 },
      { id: "curr-gbp", label: "GBP (£)", count: 96 },
    ],
  },
  {
    id: "region",
    title: "Subsidiary Region",
    options: [
      { id: "reg-na", label: "North America", count: 720 },
      { id: "reg-emea", label: "EMEA", count: 430 },
      { id: "reg-apac", label: "APAC", count: 140 },
    ],
  },
];

export const Default: Story = {
  args: {
    groups: sampleGroups,
    selectedOptionIds: ["opt-pending", "curr-usd"],
    density: "standard",
    onToggleOption: (grp, opt) => console.log(`Toggle: ${grp} -> ${opt}`),
    onClearAll: () => console.log("Clear all"),
  },
};

export const Compact: Story = {
  args: {
    groups: sampleGroups,
    selectedOptionIds: [],
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Active Filters Applied</p>
        <FacetedFilterNavigationRail
          groups={sampleGroups}
          selectedOptionIds={["opt-pending", "curr-usd"]}
          onToggleOption={() => {}}
          onClearAll={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Clean State</p>
        <FacetedFilterNavigationRail
          groups={sampleGroups}
          selectedOptionIds={[]}
          onToggleOption={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
      <FacetedFilterNavigationRail
        groups={sampleGroups}
        selectedOptionIds={["opt-pending"]}
        onToggleOption={() => {}}
        density="ultra-compact"
      />
      <FacetedFilterNavigationRail
        groups={sampleGroups}
        selectedOptionIds={["opt-approved"]}
        onToggleOption={() => {}}
        density="compact"
      />
      <FacetedFilterNavigationRail
        groups={sampleGroups}
        selectedOptionIds={["curr-eur"]}
        onToggleOption={() => {}}
        density="standard"
      />
      <FacetedFilterNavigationRail
        groups={sampleGroups}
        selectedOptionIds={["reg-na"]}
        onToggleOption={() => {}}
        density="comfortable"
      />
    </div>
  ),
};
