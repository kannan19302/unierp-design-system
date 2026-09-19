import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { HierarchicalPathDropdownTrail } from "./hierarchical-path-dropdown-trail";

const meta: Meta<typeof HierarchicalPathDropdownTrail> = {
  title: "Navigation/HierarchicalPathDropdownTrail",
  component: HierarchicalPathDropdownTrail,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof HierarchicalPathDropdownTrail>;

const sampleSegments = [
  {
    id: "org",
    label: "Acme Global Enterprise",
    siblings: [
      { id: "org1", label: "Acme Global Enterprise", isCurrent: true },
      { id: "org2", label: "Starlight Corp UK" },
      { id: "org3", label: "Nexus Tech APAC" },
    ],
  },
  {
    id: "subsidiary",
    label: "North America Operations",
    siblings: [
      { id: "sub1", label: "North America Operations", isCurrent: true },
      { id: "sub2", label: "EMEA Headquarters" },
      { id: "sub3", label: "LATAM Distribution" },
    ],
  },
  {
    id: "division",
    label: "Heavy Equipment",
    siblings: [
      { id: "div1", label: "Heavy Equipment", isCurrent: true },
      { id: "div2", label: "Aerospace Systems" },
      { id: "div3", label: "Precision Tools" },
    ],
  },
  {
    id: "ledger",
    label: "FY2026 Q3 Cost Centers",
  },
];

export const Default: Story = {
  args: {
    segments: sampleSegments,
    density: "standard",
    showCopyPath: true,
  },
};

export const Compact: Story = {
  args: {
    segments: sampleSegments,
    density: "compact",
    showCopyPath: true,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard 4-Level Enterprise Path</p>
        <HierarchicalPathDropdownTrail
          segments={sampleSegments}
          density="standard"
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Path Without Copy</p>
        <HierarchicalPathDropdownTrail
          segments={sampleSegments.slice(0, 3)}
          density="compact"
          showCopyPath={false}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <HierarchicalPathDropdownTrail segments={sampleSegments} density="ultra-compact" />
      <HierarchicalPathDropdownTrail segments={sampleSegments} density="compact" />
      <HierarchicalPathDropdownTrail segments={sampleSegments} density="standard" />
      <HierarchicalPathDropdownTrail segments={sampleSegments} density="comfortable" />
    </div>
  ),
};
