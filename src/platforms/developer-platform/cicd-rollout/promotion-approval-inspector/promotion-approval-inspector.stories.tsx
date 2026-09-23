import type { Meta, StoryObj } from "@storybook/react";
import { PromotionApprovalInspector } from "./promotion-approval-inspector";

const meta: Meta<typeof PromotionApprovalInspector> = {
  title: "Platforms/DeveloperPlatform/CicdRollout/PromotionApprovalInspector",
  component: PromotionApprovalInspector,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof PromotionApprovalInspector>;

export const Default: Story = {
  args: {
    releaseVersion: "v2.5.0",
    targetEnvironment: "Production Multi-Tenant",
    author: "sarah.chen@acme.corp",
    currentReviewer: "marcus.vance@acme.corp",
    reviewerRole: "Principal SRE / Release Manager",
    canApprove: true,
    onApprove: (notes) => alert(`Approved with notes: ${notes}`),
    onReject: (reason) => alert(`Rejected with reason: ${reason}`),
    changesSummary: {
      filesCount: 18,
      migrationsCount: 1,
      riskLevel: "low",
      breakingChangesCount: 0,
    },
  },
};

export const SelfApprovalViolation: Story = {
  args: {
    releaseVersion: "v2.5.0-hotfix.1",
    targetEnvironment: "Production Multi-Tenant",
    author: "sarah.chen@acme.corp",
    currentReviewer: "sarah.chen@acme.corp",
    reviewerRole: "Engineering Lead",
    canApprove: true,
    onApprove: () => {},
    onReject: () => {},
    changesSummary: {
      filesCount: 3,
      migrationsCount: 0,
      riskLevel: "medium",
      breakingChangesCount: 0,
    },
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxInlineSize: "600px" }}>
      <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
        <strong>PromotionApprovalInspector Anatomy:</strong>
        <ol style={{ margin: "var(--space-2) 0", paddingInlineStart: "var(--space-4)" }}>
          <li>Header Bar (Tagline + promotion version and target cluster)</li>
          <li>Separation of Duties Alert Banner (Prevents author self-approval)</li>
          <li>Reviewer vs Author Identity Grid</li>
          <li>Impact Metrics Row (Files changed, DB migrations, breaking changes count, risk level)</li>
          <li>Audit Notes Textarea & Dual Decision Action Buttons (Reject vs Approve & Deploy)</li>
        </ol>
      </div>
      <PromotionApprovalInspector
        releaseVersion="v2.5.0"
        targetEnvironment="Production Multi-Tenant"
        author="sarah.chen@acme.corp"
        currentReviewer="marcus.vance@acme.corp"
        onApprove={() => {}}
        onReject={() => {}}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Authorized Peer Reviewer</h4>
        <PromotionApprovalInspector
          releaseVersion="v2.5.0"
          targetEnvironment="Production Multi-Tenant"
          author="sarah.chen@acme.corp"
          currentReviewer="marcus.vance@acme.corp"
          onApprove={() => {}}
          onReject={() => {}}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)" }}>Blocked Self-Approval</h4>
        <PromotionApprovalInspector
          releaseVersion="v2.5.0"
          targetEnvironment="Production Multi-Tenant"
          author="alex.dev@acme.corp"
          currentReviewer="alex.dev@acme.corp"
          onApprove={() => {}}
          onReject={() => {}}
        />
      </div>
    </div>
  ),
};
