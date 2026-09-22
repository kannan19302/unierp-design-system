import type { Meta, StoryObj } from "@storybook/react";
import { BrandMark } from "./brand-mark";

const meta: Meta<typeof BrandMark> = {
  title: "Primitives/BrandMark",
  component: BrandMark,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Canonical UniERP enterprise product brandmark and logotype. Renders precision SVG mark with synchronized typographic scaling across all device viewports and header bars.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Proportional logo mark and typography scale tier (sm: 24px, md: 30px, lg: 40px).",
      table: {
        type: { summary: "sm | md | lg" },
        defaultValue: { summary: "md" },
      },
    },
    compact: {
      control: "boolean",
      description: "When true, suppresses the 'UniERP' wordmark and renders mark icon only.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BrandMark>;

export const Default: Story = {
  args: {
    size: "md",
    compact: false,
  },
};

export const Compact: Story = {
  args: {
    size: "md",
    compact: true,
  },
};

export const LargeHero: Story = {
  args: {
    size: "lg",
    compact: false,
  },
};

export const SizesMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Full Wordmark Tiers (sm: 24px / 14px, md: 30px / 18px, lg: 40px / 24px)</div>
      <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "center" }}>
        <BrandMark size="sm" />
        <BrandMark size="md" />
        <BrandMark size="lg" />
      </div>
    </div>
    <div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-2)" }}>Compact Mark Only (App Launchers & Collapsed Sidenav)</div>
      <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
        <BrandMark size="sm" compact />
        <BrandMark size="md" compact />
        <BrandMark size="lg" compact />
      </div>
    </div>
  </div>
);

export const AnatomyAndComposition = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", maxWidth: 500 }}>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      Sub-elements: SVG Glyph Geometry + Primary Wordmark ("Uni") + High-Contrast Product Accent ("ERP")
    </div>
    <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
      <BrandMark size="lg" />
      <BrandMark size="md" compact />
    </div>
  </div>
);

export const AllStatesGallery = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
    {/* Row 1: Wordmark Full vs Compact */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        All Sizing & Compact Modes in One Place
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
          <BrandMark size="sm" />
          <BrandMark size="md" />
          <BrandMark size="lg" />
        </div>
        <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
          <BrandMark size="sm" compact />
          <BrandMark size="md" compact />
          <BrandMark size="lg" compact />
        </div>
      </div>
    </div>

    {/* Row 2: Header Surface Integration */}
    <div>
      <div style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: "var(--color-text)", marginBottom: "var(--space-2)" }}>
        Application Bar Placement
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          padding: "var(--space-2-5) var(--space-4)",
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <BrandMark size="md" />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Tenant: Acme Corp</span>
      </div>
    </div>
  </div>
);
