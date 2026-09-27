import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./tabs";
import { FileText, Shield, Activity } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "Core/Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["underline", "pills"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const sampleTabs = [
  { key: "gl", label: "General Ledger", icon: <FileText size={14} />, badge: "12" },
  { key: "audit", label: "Audit Trail", icon: <Shield size={14} /> },
  { key: "perf", label: "Performance", icon: <Activity size={14} /> },
];

export const Underline: Story = {
  args: {
    value: "gl",
    variant: "underline",
    tabs: sampleTabs,
  },
};

export const Pills: Story = {
  args: {
    value: "day",
    variant: "pills",
    tabs: [
      { key: "day", label: "Day" },
      { key: "week", label: "Week" },
      { key: "month", label: "Month" },
      { key: "year", label: "Year" },
    ],
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Underline Variant</p>
        <Tabs tabs={sampleTabs} value="gl" onChange={() => {}} variant="underline" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Pills Variant</p>
        <Tabs tabs={sampleTabs} value="audit" onChange={() => {}} variant="pills" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <Tabs tabs={sampleTabs} value="gl" onChange={() => {}} />
      <Tabs tabs={sampleTabs} value="audit" onChange={() => {}} />
      <Tabs tabs={sampleTabs} value="perf" onChange={() => {}} />
    </div>
  ),
};
