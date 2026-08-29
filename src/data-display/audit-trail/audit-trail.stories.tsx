import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalTimeline, AuditTrailPanel } from "./audit-trail";

const meta: Meta = {
  title: "DataDisplay/AuditTrail",
  tags: ["autodocs"],
};

export default meta;

export const Approval = () => (
  <ApprovalTimeline
    steps={[
      { id: "1", approver: "Sarah Lin", role: "Direct Manager", status: "approved", timestamp: "2026-08-29 09:15", notes: "Budget line verified." },
      { id: "2", approver: "Marcus Vance", role: "Finance Director", status: "approved", timestamp: "2026-08-29 11:30" },
      { id: "3", approver: "Elena Rostova", role: "CFO", status: "pending" },
    ]}
  />
);

export const AuditPanel = () => (
  <AuditTrailPanel
    logs={[
      { id: "1", user: "kannan@unierp.org", action: "modified tax rate rule #4", time: "2026-08-29 12:04:18 UTC", hash: "sha256:8f4a...19e2" },
      { id: "2", user: "system_cron", action: "recalculated currency conversions", time: "2026-08-29 12:00:00 UTC", hash: "sha256:1a9b...44c1" },
    ]}
  />
);
