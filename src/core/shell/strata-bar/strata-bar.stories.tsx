import type { Meta, StoryObj } from "@storybook/react";
import { StrataBar } from "./strata-bar";
import { Button } from "../../primitives/button";

const meta: Meta<typeof StrataBar> = {
  title: "Core/Shell/StrataBar",
  component: StrataBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
          { id: "landmark-one-main", enabled: false },
        ],
      },
    },
  },
  argTypes: {
    scope: {
      control: "select",
      options: ["app", "site", "library", "manage"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof StrataBar>;

export const Default: Story = {
  args: {
    segments: ["acme", "finance", "invoices", "INV-2043"],
    state: { kind: "warning", label: "Awaiting approval" },
    action: <Button variant="primary" size="sm">Approve</Button>,
  },
};

export const WithLifecycle: Story = {
  args: {
    segments: ["acme", "sales", "orders", "SO-9921"],
    lifecycle: [
      { id: "draft", label: "Draft" },
      { id: "review", label: "In Review", active: true },
      { id: "approved", label: "Approved" },
      { id: "posted", label: "Posted" },
    ],
    activeUsers: ["JD", "AS"],
    state: { kind: "info", label: "Under Review" },
    action: <Button variant="primary" size="sm">Submit</Button>,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", padding: "var(--space-4)" }}>
      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
        <strong>Strata Context Anatomy:</strong> [1] Scope Hue Indicator | [2] Resource Breadcrumb Hierarchy | [3] Copy Identifier Action | [4] Status Pill | [5] Multi-stage Lifecycle Chevrons | [6] Active Viewers | [7] Primary Terminal Action
      </div>
      <StrataBar
        scope="app"
        segments={["acme-corp", "treasury", "disbursements", "DISB-2026-0098"]}
        state={{ kind: "warning", label: "Pending Dual Sign-off" }}
        lifecycle={[
          { id: "created", label: "Created", completed: true },
          { id: "verification", label: "Verification", completed: true },
          { id: "dual_approval", label: "Dual Approval", active: true },
          { id: "disbursed", label: "Disbursed" },
        ]}
        activeUsers={["KP", "AL", "MS"]}
        action={<Button variant="primary" size="sm">Authorize Disbursement</Button>}
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          1. Neutral / Draft State (Manage Scope)
        </h4>
        <StrataBar
          scope="manage"
          segments={["acme", "settings", "tax-regimes", "DRAFT-2026"]}
          state={{ kind: "neutral", label: "Draft" }}
          lifecycle={[
            { id: "draft", label: "Draft", active: true },
            { id: "effective", label: "Effective" },
          ]}
          action={<Button variant="secondary" size="sm">Save Changes</Button>}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          2. In Review / Warning State (App Scope)
        </h4>
        <StrataBar
          scope="app"
          segments={["acme", "general-ledger", "journals", "JRN-8942"]}
          state={{ kind: "warning", label: "Pending Period Close Review" }}
          lifecycle={[
            { id: "draft", label: "Draft", completed: true },
            { id: "review", label: "In Review", active: true },
            { id: "posted", label: "Posted" },
          ]}
          activeUsers={["FA", "SK"]}
          action={<Button variant="primary" size="sm">Approve Journal</Button>}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          3. Posted / Success State (Library Scope)
        </h4>
        <StrataBar
          scope="library"
          segments={["acme", "catalog", "schema-definitions", "ORDER_V2"]}
          state={{ kind: "success", label: "Published & Locked" }}
          lifecycle={[
            { id: "spec", label: "Draft", completed: true },
            { id: "staged", label: "Staged", completed: true },
            { id: "published", label: "Published", completed: true, active: true },
          ]}
          action={<Button variant="secondary" size="sm">Create New Version</Button>}
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          4. Danger / Failed State (Site Scope)
        </h4>
        <StrataBar
          scope="site"
          segments={["acme", "web-builder", "deployments", "DEP-9021"]}
          state={{ kind: "danger", label: "Build Gate Failed" }}
          lifecycle={[
            { id: "build", label: "Build", completed: true },
            { id: "gate", label: "Lint Gate", active: true },
            { id: "cdn", label: "CDN Deploy" },
          ]}
          action={<Button variant="danger" size="sm">Retry Pipeline</Button>}
        />
      </div>
    </div>
  ),
};
