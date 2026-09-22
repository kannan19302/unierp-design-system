import type { Meta, StoryObj } from "@storybook/react";
import { ApprovalTimeline, AuditTrailPanel } from "./audit-trail";

const meta: Meta = {
  title: "Data Display/AuditTrail",
  tags: ["autodocs"],
};

export default meta;

const sampleSteps = [
  { id: "1", approver: "Sarah Lin", role: "Direct Manager", status: "approved" as const, timestamp: "2026-08-29 09:15", notes: "Budget line verified." },
  { id: "2", approver: "Marcus Vance", role: "Finance Director", status: "approved" as const, timestamp: "2026-08-29 11:30" },
  { id: "3", approver: "Elena Rostova", role: "CFO", status: "pending" as const },
];

const sampleLogs = [
  { id: "1", user: "kannan@unierp.org", action: "modified tax rate rule #4", time: "2026-08-29 12:04:18 UTC", hash: "sha256:8f4a...19e2" },
  { id: "2", user: "system_cron", action: "recalculated currency conversions", time: "2026-08-29 12:00:00 UTC", hash: "sha256:1a9b...44c1" },
];

export const Approval = () => (
  <ApprovalTimeline steps={sampleSteps} />
);

export const AuditPanel = () => (
  <AuditTrailPanel logs={sampleLogs} />
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "2rem", inlineSize: "100%" }}>
    <ApprovalTimeline steps={sampleSteps} />
    <AuditTrailPanel logs={sampleLogs} />
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "2rem", inlineSize: "100%" }}>
    <div>
      <h4 style={{ marginBlockEnd: "0.5rem" }}>Approval Timeline</h4>
      <ApprovalTimeline steps={sampleSteps} />
    </div>
    <div>
      <h4 style={{ marginBlockEnd: "0.5rem" }}>Audit Trail Verification Panel</h4>
      <AuditTrailPanel logs={sampleLogs} />
    </div>
  </div>
);
