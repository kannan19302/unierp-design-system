import type { Meta, StoryObj } from "@storybook/react";
import { PlatformWizardGrid, type WizardTile } from "./wizard-grid";

const MOCK_TILES: WizardTile[] = [
  {
    key: "p1",
    name: "Provider Admin OS",
    description: "Multi-tenant orchestration, database sharding, and provider telemetry.",
    href: "#",
    accent: "#3b82f6",
  },
  {
    key: "p2",
    name: "Tenant Admin Console",
    description: "RBAC, security policies, SSO integration, and billing settings.",
    href: "#",
    accent: "#10b981",
  },
  {
    key: "p3",
    name: "Web Studio",
    description: "Visual builder for customer websites and portal templates.",
    href: "#",
    accent: "#8b5cf6",
  },
  {
    key: "p4",
    name: "Developer Platform",
    description: "SDK generator, OpenAPI specs, and extension sandbox.",
    href: "#",
    accent: "#f59e0b",
  },
];

const meta: Meta<typeof PlatformWizardGrid> = {
  title: "Shell/PlatformWizardGrid",
  component: PlatformWizardGrid,
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
    loading: { control: "boolean" },
    loadingVariant: {
      control: "select",
      options: ["spinner", "skeleton"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PlatformWizardGrid>;

export const Default: Story = {
  args: {
    tiles: MOCK_TILES,
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Populated Platform Grid</h4>
        <PlatformWizardGrid tiles={MOCK_TILES} />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Skeleton Loading State</h4>
        <PlatformWizardGrid tiles={[]} loading={true} loadingVariant="skeleton" />
      </div>

      <div>
        <h4 style={{ marginBottom: "var(--space-2)", color: "var(--color-text-secondary)" }}>Empty State</h4>
        <PlatformWizardGrid
          tiles={[]}
          emptyTitle="No platforms available"
          emptyDescription="Your account is not entitled to any active platforms."
        />
      </div>
    </div>
  ),
};

