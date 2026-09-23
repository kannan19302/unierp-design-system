import type { Meta, StoryObj } from "@storybook/react";
import { LaunchShell, type LaunchPlate } from "./launch-shell";

const MOCK_PLATES: LaunchPlate[] = [
  {
    key: "tenant-admin",
    name: "Tenant Admin Console",
    description: "Manage users, access control policies, billing settings, and enterprise security.",
    href: "#",
    code: ":4002",
    accent: "#3b82f6",
  },
  {
    key: "web-studio",
    name: "Web Studio Designer",
    description: "Visual canvas and block composition tool for portal websites.",
    href: "#",
    code: ":4003",
    accent: "#10b981",
  },
  {
    key: "marketplace",
    name: "Integration Marketplace",
    description: "Discover and configure third-party partner connectors and extensions.",
    href: "#",
    code: ":4005",
    accent: "#f59e0b",
  },
];

const meta: Meta<typeof LaunchShell> = {
  title: "Core/Shell/LaunchShell",
  component: LaunchShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    a11y: {
      element: "#storybook-root",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["hero", "shelf"],
    },
    filterable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof LaunchShell>;

export const HeroLauncher: Story = {
  args: {
    variant: "hero",
    title: "Select an Enterprise Application",
    lede: "Choose a platform workspace to begin your session.",
    plates: MOCK_PLATES,
  },
};

export const ShelfLauncher: Story = {
  args: {
    variant: "shelf",
    title: "Installed Business Modules",
    lede: "Quick jump to your licensed enterprise tools.",
    plates: MOCK_PLATES,
  },
};

export const AnatomyAndComposition: Story = {
  name: "Anatomy & Composition",
  args: {
    ...HeroLauncher.args,
  },
};

export const AllStatesGallery: Story = {
  name: "All States Gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Hero Scale (Standalone Fullscreen Launcher)</h4>
        <div style={{ height: "420px", border: "1px solid var(--color-border)", position: "relative" }}>
          <LaunchShell
            variant="hero"
            title="Global Platform Launcher"
            lede="Select an entitled platform application."
            plates={MOCK_PLATES}
          />
        </div>
      </div>

      <div>
        <h4 style={{ margin: "var(--space-2) var(--space-4)", color: "var(--color-text-secondary)" }}>Shelf Scale (Embedded App Grid)</h4>
        <div style={{ height: "350px", border: "1px solid var(--color-border)", position: "relative" }}>
          <LaunchShell
            variant="shelf"
            title="Installed Applications"
            lede="Active organization workspace extensions."
            plates={MOCK_PLATES}
          />
        </div>
      </div>
    </div>
  ),
};
