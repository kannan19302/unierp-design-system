import type { Meta, StoryObj } from "@storybook/react";
import { ContextRail } from "./context-rail";

const meta: Meta<typeof ContextRail> = {
  title: "LAYOUT/ContextRail",
  component: ContextRail,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContextRail>;

export const Default: Story = {
  args: {
    title: "Document Inspector",
    tabs: [
      { id: "details", label: "Details", content: <div>Invoice #INV-2026 details</div> },
      { id: "activity", label: "Activity", badge: 3, content: <div>3 recorded audit events</div> },
      { id: "comments", label: "Comments", badge: 1, content: <div>1 open comment thread</div> },
    ],
  },
};
