import type { Meta, StoryObj } from "@storybook/react";
import { WorkspaceGlobalRail, defaultSuites } from "./workspace-global-rail";

const meta: Meta<typeof WorkspaceGlobalRail> = {
  title: "Navigation/WorkspaceGlobalRail",
  component: WorkspaceGlobalRail,
  parameters: {
    layout: "fullscreen",
    a11y: {
      config: {
        rules: [
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof WorkspaceGlobalRail>;

export const Default: Story = {
  args: {
    density: "compact",
  },
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
    activeSuiteId: "suite_crm",
  },
};

export const Comfortable: Story = {
  args: {
    density: "comfortable",
    activeSuiteId: "suite_bi",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)", height: "550px", padding: "var(--space-4)" }}>
      <WorkspaceGlobalRail
        currentOrgName="Acme Enterprise Inc"
        currentOrgAbbr="AE"
        activeSuiteId="suite_erp"
        suites={defaultSuites}
        userInitials="KP"
        isUserOnline={true}
      />
      <div style={{ flex: 1, padding: "var(--space-4)", background: "var(--color-bg-sunken)", borderRadius: "var(--radius-md)" }}>
        <h3 style={{ margin: "0 0 var(--space-2) 0" }}>Global Workspace Rail Anatomy</h3>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)" }}>
          The 48px global rail provides unified tenant switching and cross-suite navigation:
        </p>
        <ul style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-sm)", lineHeight: 1.6 }}>
          <li><strong>Tenant Switcher:</strong> Top circular button with monogram abbreviation.</li>
          <li><strong>Suite Menu Items:</strong> Vertical suite list with 3-character acronyms and active indicator pill.</li>
          <li><strong>Notification Badges:</strong> Unread item counter attached to each suite.</li>
          <li><strong>Utility Actions:</strong> Bottom quick access to platform settings (⚙).</li>
          <li><strong>User Profile:</strong> Bottom avatar with online/offline presence dot.</li>
        </ul>
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-8)", height: "500px", padding: "var(--space-4)", background: "var(--color-bg-sunken)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
          1. Default Online (ERP Active)
        </h4>
        <div style={{ height: "450px" }}>
          <WorkspaceGlobalRail
            activeSuiteId="suite_erp"
            isUserOnline={true}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
          2. Developer OS Active (DEV)
        </h4>
        <div style={{ height: "450px" }}>
          <WorkspaceGlobalRail
            activeSuiteId="suite_dev"
            isUserOnline={true}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" }}>
          3. Offline Status & Custom Monogram
        </h4>
        <div style={{ height: "450px" }}>
          <WorkspaceGlobalRail
            currentOrgAbbr="SC"
            currentOrgName="Starlight Corp"
            activeSuiteId="suite_crm"
            userInitials="JD"
            isUserOnline={false}
          />
        </div>
      </div>
    </div>
  ),
};
