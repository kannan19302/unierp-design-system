import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "Brand/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["horizontal", "stacked", "glyph", "wordmark"]
    },
    theme: {
      control: "select",
      options: ["light", "dark", "monochrome"]
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"]
    },
    showTagline: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const HorizontalLight: Story = {
  args: {
    variant: "horizontal",
    theme: "light",
    size: "md",
    showTagline: true
  }
};

export const HorizontalDark: Story = {
  render: () => (
    <div style={{ background: "#090e1a", padding: "24px", borderRadius: "8px" }}>
      <Logo variant="horizontal" theme="dark" size="md" showTagline={true} />
    </div>
  )
};

export const StackedHero: Story = {
  args: {
    variant: "stacked",
    theme: "light",
    size: "lg",
    showTagline: true
  }
};

export const GlyphOnly: Story = {
  args: {
    variant: "glyph",
    theme: "light",
    size: "md"
  }
};

export const SizeMatrix = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
    <Logo variant="horizontal" size="sm" />
    <Logo variant="horizontal" size="md" />
    <Logo variant="horizontal" size="lg" />
    <Logo variant="horizontal" size="xl" />
  </div>
);
