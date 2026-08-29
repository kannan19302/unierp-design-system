import type { Meta, StoryObj } from "@storybook/react";
import { ContextRail } from "./context-rail";
import { Activity, MessageSquare, Sparkles, Paperclip } from "lucide-react";

const meta: Meta<typeof ContextRail> = {
  title: "Components/ContextRail",
  component: ContextRail,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof ContextRail>;

export const Default: Story = {
  render: () => (
    <div style={{ display: "flex", height: "500px", border: "1px solid var(--color-border)" }}>
      <div style={{ flex: 1, padding: "var(--space-6)" }}>
        <h3>Main Document Area</h3>
        <p>Invoice #INV-2024-001 content displayed here.</p>
      </div>
      <ContextRail
        tabs={[
          {
            id: "activity",
            label: "Activity",
            icon: <Activity size={18} />,
            content: (
              <div style={{ padding: "var(--space-4)" }}>
                <h4>Audit History</h4>
                <p>Created by Admin at 09:00 AM</p>
                <p>Status changed to Approved at 10:15 AM</p>
              </div>
            ),
          },
          {
            id: "comments",
            label: "Comments",
            icon: <MessageSquare size={18} />,
            badge: 3,
            content: (
              <div style={{ padding: "var(--space-4)" }}>
                <h4>Internal Notes</h4>
                <p>John: Verified bank details.</p>
              </div>
            ),
          },
          {
            id: "ai",
            label: "AI Copilot",
            icon: <Sparkles size={18} />,
            content: (
              <div style={{ padding: "var(--space-4)" }}>
                <h4>AI Risk Assessment</h4>
                <p>Anomaly Score: 0.02 (Low Risk)</p>
              </div>
            ),
          },
          {
            id: "attachments",
            label: "Files",
            icon: <Paperclip size={18} />,
            content: (
              <div style={{ padding: "var(--space-4)" }}>
                <h4>Attached Documents</h4>
                <p>Receipt_PO842.pdf (1.2 MB)</p>
              </div>
            ),
          },
        ]}
      />
    </div>
  ),
};
