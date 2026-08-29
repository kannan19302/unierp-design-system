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
  title: "Shell/LaunchShell",
  component: LaunchShell,
  parameters: { layout: "fullscreen" },
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
