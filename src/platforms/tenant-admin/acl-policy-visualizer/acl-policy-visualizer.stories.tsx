import type { Meta, StoryObj } from "@storybook/react";
import { AclPolicyVisualizer } from "./acl-policy-visualizer";

/**
 * `AclPolicyVisualizer` delivers an interactive Zero-Trust IAM policy builder,
 * displaying Allow/Deny effect toggles, action lists, URN resource patterns,
 * and context guards (MFA, IP blocks), with a synchronized raw JSON preview mode.
 *
 * ### Architectural Features
 * - **Effect Badges**: High-contrast green (Allow) and red (Deny) status pills.
 * - **Dual Presentation**: Seamlessly toggle between visual card canvas and raw JSON view.
 * - **Dynamic Expansion**: Add new statements and mutate conditions directly in the visualizer.
 */
const meta: Meta<typeof AclPolicyVisualizer> = {
  title: "Platforms/TenantAdmin/AclPolicyVisualizer",
  component: AclPolicyVisualizer,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Enterprise IAM policy designer with statement cards, condition guards, and JSON schema inspection.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    policyName: {
      control: "text",
      description: "Descriptive name of the security policy document",
    },
    density: {
      control: { type: "radio" },
      options: ["compact", "comfortable"],
      description: "Visual density spacing tier",
    },
    initialStatements: {
      control: "object",
      description: "List of ACL statement rules",
    },
    onChange: {
      action: "policyChanged",
      description: "Callback invoked when statements are modified",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AclPolicyVisualizer>;

export const DefaultPolicy: Story = {
  args: {
    policyName: "ZeroTrust-Tenant-Isolation-Enforcer",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", maxWidth: 700 }}>
      <div style={{ padding: "var(--space-md)", border: "1px dashed var(--color-border-subtle)", borderRadius: "var(--radius-md)" }}>
        <div style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-fg-muted)", marginBottom: "var(--space-xs)" }}>
          ANATOMY: POLICY HEADER / STATEMENT CARDS (EFFECT, ACTIONS, RESOURCES, GUARDS) / VIEW TOGGLE
        </div>
        <AclPolicyVisualizer policyName="Financial-Ledger-Authorizer" />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)", maxWidth: 720 }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Compact Mode (High Density Table View)
        </h4>
        <AclPolicyVisualizer
          policyName="Audit-Logging-Restriction-Policy"
          density="compact"
        />
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-xs) 0", fontSize: "var(--font-size-sm)", color: "var(--color-fg-muted)" }}>
          Comfortable Mode (Spaced Form Layout)
        </h4>
        <AclPolicyVisualizer
          policyName="Human-Resources-Confidential-Records"
          density="comfortable"
        />
      </div>
    </div>
  ),
};
