import type { Meta, StoryObj } from "@storybook/react";
import { MeridianBar } from "./meridian-bar";

const meta: Meta<typeof MeridianBar> = {
  title: "Shell/MeridianBar",
  component: MeridianBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    scope: {
      control: "select",
      options: ["core", "app", "manage", "tenant", "system"],
    },
    copyable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof MeridianBar>;

export const InvoiceApproval: Story = {
  args: {
    segments: [
      { label: "acme-corp", href: "#" },
      { label: "finance", href: "#" },
      { label: "invoices", href: "#" },
      { label: "INV-2043" },
    ],
    copyable: true,
    state: { label: "Awaiting Approval", tone: "warning" },
    action: {
      label: "Approve Invoice",
      onClick: () => alert("Invoice Approved"),
    },
    scope: "app",
  },
};

export const DisabledWithReason: Story = {
  args: {
    segments: [
      { label: "acme-corp" },
      { label: "billing" },
      { label: "subscription" },
    ],
    state: { label: "Locked", tone: "danger" },
    action: {
      label: "Cancel Subscription",
      disabled: true,
      disabledReason: "Only Organization Owners can cancel plans",
    },
    scope: "manage",
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...InvoiceApproval.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Awaiting Approval (App Scope)</span>
        <MeridianBar
          segments={[
            { label: "acme-corp", href: "#" },
            { label: "finance", href: "#" },
            { label: "invoices", href: "#" },
            { label: "INV-2043" },
          ]}
          copyable
          state={{ label: "Awaiting Approval", tone: "warning" }}
          action={{ label: "Approve Invoice" }}
          scope="app"
        />
      </div>

      <div>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Locked / Disabled with Explanatory Reason</span>
        <MeridianBar
          segments={[
            { label: "acme-corp" },
            { label: "billing" },
            { label: "subscription" },
          ]}
          state={{ label: "Locked", tone: "danger" }}
          action={{
            label: "Cancel Subscription",
            disabled: true,
            disabledReason: "Requires Organization Owner permission",
          }}
          scope="manage"
        />
      </div>

      <div>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Operational / Active (Success Tone)</span>
        <MeridianBar
          segments={[
            { label: "acme-corp", href: "#" },
            { label: "infrastructure", href: "#" },
            { label: "clusters", href: "#" },
            { label: "eu-west-primary" },
          ]}
          copyable
          state={{ label: "Healthy", tone: "success" }}
          action={{ label: "Trigger Failover" }}
          scope="system"
        />
      </div>

      <div>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Calm / Default (No Pending State)</span>
        <MeridianBar
          segments={[
            { label: "acme-corp", href: "#" },
            { label: "settings", href: "#" },
            { label: "security" },
          ]}
          copyable
          scope="core"
        />
      </div>
    </div>
  ),
};
