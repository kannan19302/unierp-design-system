import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { FileText, Shield, Activity, Settings, User } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "error" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["underline", "pills"],
      description: "Visual appearance style of the tab controls.",
    },
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
      description: "Strata 4-tier density scaling.",
    },
    value: {
      control: "text",
      description: "Key of the currently active tab.",
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
    density: "standard",
    tabs: sampleTabs,
  },
};

export const Pills: Story = {
  args: {
    value: "day",
    variant: "pills",
    density: "standard",
    tabs: [
      { key: "day", label: "Day" },
      { key: "week", label: "Week" },
      { key: "month", label: "Month" },
      { key: "year", label: "Year" },
    ],
  },
};

export const DensityGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", inlineSize: "500px" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Ultra-compact (24px)</p>
        <Tabs tabs={sampleTabs} value="gl" onChange={() => {}} density="ultra-compact" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Compact (28px)</p>
        <Tabs tabs={sampleTabs} value="gl" onChange={() => {}} density="compact" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Standard (32px)</p>
        <Tabs tabs={sampleTabs} value="gl" onChange={() => {}} density="standard" />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-1)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Comfortable (40px)</p>
        <Tabs tabs={sampleTabs} value="gl" onChange={() => {}} density="comfortable" />
      </div>
    </div>
  ),
};

export const CompoundComponents: Story = {
  render: () => (
    <div style={{ inlineSize: "500px" }}>
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account" icon={<User size={14} />}>Account</TabsTrigger>
          <TabsTrigger value="settings" icon={<Settings size={14} />}>Settings</TabsTrigger>
          <TabsTrigger value="audit" badge="3">Audit Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Manage your enterprise account and security credentials.</p>
        </TabsContent>
        <TabsContent value="settings">
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Configure localization, notification thresholds, and API keys.</p>
        </TabsContent>
        <TabsContent value="audit">
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Inspect tamper-evident immutable audit entries for this tenant.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
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
