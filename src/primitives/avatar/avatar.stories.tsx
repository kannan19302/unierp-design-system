import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "User and team identity primitive supporting circular and rounded square geometries, image fallbacks with automated high-contrast pastel palettes, live presence status indicators, and grouped stack layouts with overflow counts.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description: "Diameter tier (xs: 20px, sm: 24px, md: 32px, lg: 40px, xl: 48px).",
      table: {
        type: { summary: "xs | sm | md | lg | xl" },
        defaultValue: { summary: "md" },
      },
    },
    shape: {
      control: "radio",
      options: ["circle", "square"],
      description: "Geometry of the avatar container.",
      table: {
        type: { summary: "circle | square" },
        defaultValue: { summary: "circle" },
      },
    },
    presence: {
      control: "select",
      options: ["online", "busy", "away", "offline"],
      description: "Optional real-time activity status dot positioned at bottom-right.",
    },
    name: {
      control: "text",
      description: "Full user or organization name used for auto-generated initials.",
    },
    src: {
      control: "text",
      description: "URL of remote profile image with graceful error fallback.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    name: "Kannan Admin",
    size: "md",
  },
};

export const SizesAndShapes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Circular Sizes (xs, sm, md, lg, xl)</div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <Avatar name="Jane Doe" size="xs" />
        <Avatar name="Jane Doe" size="sm" />
        <Avatar name="Jane Doe" size="md" />
        <Avatar name="Jane Doe" size="lg" />
        <Avatar name="Jane Doe" size="xl" />
      </div>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Rounded Square Sizes with Presence</div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <Avatar name="Platform Engineering" shape="square" size="xs" presence="online" />
        <Avatar name="Platform Engineering" shape="square" size="sm" presence="online" />
        <Avatar name="Platform Engineering" shape="square" size="md" presence="busy" />
        <Avatar name="Platform Engineering" shape="square" size="lg" presence="away" />
        <Avatar name="Platform Engineering" shape="square" size="xl" presence="offline" />
      </div>
    </div>
  </div>
);

export const PaletteMatrix = () => (
  <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
    <Avatar name="Alice Johnson" />
    <Avatar name="Bob Smith" />
    <Avatar name="Charlie Davis" />
    <Avatar name="Diana Prince" />
    <Avatar name="Evan Wright" />
    <Avatar name="Fiona Gallagher" />
    <Avatar name="George Clark" />
    <Avatar name="Hannah Abbott" />
  </div>
);

export const ShapeAndPresence = () => (
  <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
    <Avatar name="Sarah Connor" presence="online" size="md" />
    <Avatar name="John Doe" presence="busy" size="lg" />
    <Avatar name="Platform Engineering" shape="square" size="md" />
    <Avatar name="DevOps Workspace" shape="square" presence="away" size="lg" />
  </div>
);

export const GroupSizesAndExcess = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Small Team (max 3, size sm)</div>
      <AvatarGroup max={3} size="sm">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Davis" />
        <Avatar name="Diana Prince" />
        <Avatar name="Evan Wright" />
      </AvatarGroup>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Default Team (max 4, size md)</div>
      <AvatarGroup max={4} size="md">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Davis" />
        <Avatar name="Diana Prince" />
        <Avatar name="Evan Wright" />
        <Avatar name="Fiona Gallagher" />
      </AvatarGroup>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Leadership Stack (max 3, size lg)</div>
      <AvatarGroup max={3} size="lg">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Davis" />
        <Avatar name="Diana Prince" />
      </AvatarGroup>
    </div>
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Container Frame + Initials / Image + Real-time Presence Dot + AvatarGroup with Excess Counter
    </div>
    <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
      <Avatar name="Sarah Connor" presence="online" size="lg" />
      <AvatarGroup max={3} size="md">
        <Avatar name="Alex Vance" />
        <Avatar name="Gordon Freeman" />
        <Avatar name="Eli Vance" />
        <Avatar name="Barney Calhoun" />
      </AvatarGroup>
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    {/* Row 1: Shapes & Presence Status */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Geometries & Activity Status
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
        <Avatar name="Online User" presence="online" size="md" />
        <Avatar name="Busy User" presence="busy" size="md" />
        <Avatar name="Away User" presence="away" size="md" />
        <Avatar name="Offline User" presence="offline" size="md" />
        <Avatar name="Square Org" shape="square" presence="online" size="md" />
      </div>
    </div>

    {/* Row 2: Sizing Scale */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        All Sizing Tiers (xs: 20px, sm: 24px, md: 32px, lg: 40px, xl: 48px)
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <Avatar name="Kannan Admin" size="xs" />
        <Avatar name="Kannan Admin" size="sm" />
        <Avatar name="Kannan Admin" size="md" />
        <Avatar name="Kannan Admin" size="lg" />
        <Avatar name="Kannan Admin" size="xl" />
      </div>
    </div>

    {/* Row 3: AvatarGroup Stack with Excess Count */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        AvatarGroup with Interactive Hover Z-Index Lift
      </div>
      <AvatarGroup max={4} size="md">
        <Avatar name="Alice Johnson" />
        <Avatar name="Bob Smith" />
        <Avatar name="Charlie Davis" />
        <Avatar name="Diana Prince" />
        <Avatar name="Evan Wright" />
        <Avatar name="Fiona Gallagher" />
      </AvatarGroup>
    </div>
  </div>
);
