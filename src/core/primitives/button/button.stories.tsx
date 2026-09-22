import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Plus, ArrowRight, Trash2 } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Tactile, interactive button element supporting 6 visual hierarchies, 4 density tiers, loading spinners, leading/trailing icons, and keyboard focus rings.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger", "link"],
      description: "Visual hierarchy and semantic intent.",
      table: {
        type: { summary: "primary | secondary | outline | ghost | danger | link" },
        defaultValue: { summary: "primary" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Ergonomic control height conforming to 4-tier density.",
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "md" },
      },
    },
    isLoading: {
      control: "boolean",
      description: "Renders inline spinner and sets aria-busy.",
    },
    disabled: {
      control: "boolean",
      description: "Disables click events and applies muted contrast styling.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Action",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Action",
    variant: "secondary",
    size: "md",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Action",
    variant: "outline",
    size: "md",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Action",
    variant: "ghost",
    size: "md",
  },
};

export const Danger: Story = {
  args: {
    children: "Delete Record",
    variant: "danger",
    size: "md",
    leftIcon: <Trash2 size={14} />,
  },
};

export const WithIcons: Story = {
  args: {
    children: "Create Order",
    variant: "primary",
    leftIcon: <Plus size={14} />,
    rightIcon: <ArrowRight size={14} />,
  },
};

export const Loading: Story = {
  args: {
    children: "Saving Record...",
    variant: "primary",
    isLoading: true,
  },
};

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: Leading Icon + Label Text + Trailing Icon
    </div>
    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
      <Button variant="primary" leftIcon={<Plus size={14} />} rightIcon={<ArrowRight size={14} />}>
        Create Journal Entry
      </Button>
      <Button variant="secondary" leftIcon={<Trash2 size={14} />}>
        Archive
      </Button>
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    {/* Row 1: Interactive & Lifecycle States */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Interaction & Lifecycle States
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <span style={{ fontSize: "var(--text-2xs)", display: "block", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Default</span>
          <Button variant="primary">Default</Button>
        </div>
        <div>
          <span style={{ fontSize: "var(--text-2xs)", display: "block", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>With Icons</span>
          <Button variant="primary" leftIcon={<Plus size={14} />}>New Record</Button>
        </div>
        <div>
          <span style={{ fontSize: "var(--text-2xs)", display: "block", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Loading / Busy</span>
          <Button variant="primary" isLoading>Submitting</Button>
        </div>
        <div>
          <span style={{ fontSize: "var(--text-2xs)", display: "block", color: "var(--color-text-muted)", marginBottom: "var(--space-1)" }}>Disabled</span>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div>
    </div>

    {/* Row 2: Visual Hierarchies */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Hierarchy Matrix
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>

    {/* Row 3: Ergonomic Density Tiers */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Density Tiers (28px Compact, 32px Standard, 40px Comfortable)
      </div>
      <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
        <Button variant="primary" size="sm">Compact (28px)</Button>
        <Button variant="primary" size="md">Standard (32px)</Button>
        <Button variant="primary" size="lg">Comfortable (40px)</Button>
      </div>
    </div>
  </div>
);

