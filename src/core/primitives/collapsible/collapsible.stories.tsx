import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";

const meta: Meta<typeof Collapsible> = {
  title: "Core/Primitives/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <Collapsible>
        <CollapsibleTrigger>
          <span>Tax Breakdown Details</span>
          <ChevronDown size={14} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>State Sales Tax: 6.25% ($125.00)</div>
          <div>County Surcharge: 1.00% ($20.00)</div>
          <div>Municipal Fee: 0.50% ($10.00)</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger>
          <span>Audit Log Metadata</span>
          <ChevronDown size={14} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>Event ID: ev_9918239</div>
          <div>Actor: admin@acme.com</div>
          <div>Timestamp: 2026-09-23T08:00:00Z</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <Collapsible disabled>
        <CollapsibleTrigger>
          <span>Locked Ledger (Closed FY)</span>
          <ChevronDown size={14} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>No modifications allowed</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
