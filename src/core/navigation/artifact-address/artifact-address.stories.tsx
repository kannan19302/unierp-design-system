import type { Meta, StoryObj } from "@storybook/react";
import { ArtifactAddress } from "./artifact-address";

const meta: Meta<typeof ArtifactAddress> = {
  title: "Core/Navigation/ArtifactAddress",
  component: ArtifactAddress,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArtifactAddress>;

export const Default: Story = {
  args: {
    tenant: "acme",
    scope: "app",
    project: "hr-core",
    builder: "forms",
    artifact: "leave-request",
    version: "v2.1",
    copyable: true,
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ArtifactAddress
        tenant="acme"
        scope="app"
        project="billing"
        builder="invoicing"
        artifact="invoice-gen"
        version="v1.0"
        copyable
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Application Scope
        </h4>
        <ArtifactAddress
          tenant="acme"
          scope="app"
          project="hr-core"
          builder="forms"
          artifact="leave-request"
          version="v2.1"
          copyable
        />
      </div>

      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Library Scope (No Project)
        </h4>
        <ArtifactAddress
          tenant="acme"
          scope="library"
          project={null}
          builder="workflows"
          artifact="two-man-approval"
          copyable
        />
      </div>

      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Manage Scope
        </h4>
        <ArtifactAddress
          tenant="acme"
          scope="manage"
          project={null}
          builder="security"
          artifact="rls-policies"
        />
      </div>
    </div>
  ),
};
