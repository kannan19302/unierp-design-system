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
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof PlatformWizardGrid>;

export const Default: Story = {
  args: {
    tiles: MOCK_TILES,
  },
};
