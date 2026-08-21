import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  Collapsible,
  DescriptionList,
  ResizablePanel,
  SplitView,
  Timeline,
  TreeView,
} from "./structure";

/**
 * These stories previously imported `Container`, `Grid`, `Stack` and `Divider`
 * from "./structure" — four components that do not exist anywhere in this
 * package and have no implementation to document. The file therefore could not
 * compile at all, and none of the SEVEN components structure.tsx does export
 * had a story.
 *
 * It went unnoticed because infra/docker-compose.platform.yml mounted the
 * design-system source at /unierp-design-system/src while .storybook/main.ts
 * globs ../../design-system/src — so Storybook found zero story files, started
 * cleanly, and served an empty catalogue. Nothing ever type-checked this file.
 */
const meta: Meta = {
  title: "Components/Structure",
};

export default meta;

export const AccordionDefault: StoryObj = {
  render: () => (
    <Accordion
      items={[
        { key: "general", title: "General", content: "Tenant name, slug and region." },
        { key: "billing", title: "Billing", content: "Plan, seats and invoicing contact." },
        { key: "security", title: "Security", content: "MFA policy and session lifetime." },
      ]}
    />
  ),
};

export const CollapsibleDefault: StoryObj = {
  render: () => (
    <Collapsible title="Advanced options" defaultOpen>
      Retention window, export format and webhook target.
    </Collapsible>
  ),
};

export const SplitViewDefault: StoryObj = {
  render: () => (
    <div style={{ height: 240 }}>
      <SplitView left={<div>Record list</div>} right={<div>Record detail</div>} initialSplit={35} />
    </div>
  ),
};

export const ResizablePanelDefault: StoryObj = {
  render: () => <ResizablePanel>Drag the bottom edge to resize.</ResizablePanel>,
};

export const DescriptionListDefault: StoryObj = {
  render: () => (
    <DescriptionList
      items={[
        { label: "Tenant", value: "Acme Industrial" },
        { label: "Plan", value: "Business" },
        { label: "Region", value: "us-east-1" },
      ]}
    />
  ),
};

export const TimelineDefault: StoryObj = {
  render: () => (
    <Timeline
      items={[
        { id: "1", title: "Invoice created", timestamp: "09:12", description: "INV-2026-0891" },
        { id: "2", title: "Sent to customer", timestamp: "09:14" },
        { id: "3", title: "Payment received", timestamp: "11:03", description: "$4,250.00" },
      ]}
    />
  ),
};

export const TreeViewDefault: StoryObj = {
  render: () => (
    <TreeView
      nodes={[
        {
          id: "finance",
          label: "Finance",
          children: [
            { id: "gl", label: "General Ledger" },
            { id: "ar", label: "Receivables" },
          ],
        },
        { id: "inventory", label: "Inventory" },
      ]}
    />
  ),
};
