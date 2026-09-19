import type { Meta, StoryObj } from "@storybook/react";
import { BrandMark } from "./brand-mark";

const meta: Meta<typeof BrandMark> = {
  title: "Primitives/BrandMark",
  component: BrandMark,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    compact: { control: "boolean" },
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

export const HeaderContext = () => (
  <div
    style={{
      width: "100%",
      maxWidth: 600,
      padding: "var(--space-3) var(--space-4)",
      background: "var(--color-bg-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <BrandMark size="md" />
    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
      Enterprise Global Cloud
    </span>
  </div>
);
