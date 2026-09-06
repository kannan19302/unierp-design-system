import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./logo";

const meta: Meta<typeof Logo> = {
  title: "Brand/Logo",
  component: Logo,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["horizontal", "stacked", "glyph", "wordmark", "favicon"],
      description: "Layout lockup presentation variant",
    },
    theme: {
      control: "select",
      options: ["light", "dark", "monochrome"],
      description: "Color presentation theme",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Responsive scale preset",
    },
    showTagline: {
      control: "boolean",
      description: "Whether to display the tagline badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const HorizontalLight: Story = {
  args: {
    variant: "horizontal",
    theme: "light",
    size: "md",
    showTagline: true,
  },
};

export const HorizontalDark: Story = {
  render: (args) => (
    <div
      style={{
        background: "var(--color-surface-base, #090e1a)",
        padding: "var(--space-6, 24px)",
        borderRadius: "var(--radius-md, 8px)",
      }}
    >
      <Logo {...args} variant="horizontal" theme="dark" size="md" showTagline={true} />
    </div>
  ),
};

export const WordmarkOnly: Story = {
  args: {
    variant: "wordmark",
    size: "md",
    showTagline: false,
  },
};

export const StackedHero: Story = {
  args: {
    variant: "stacked",
    theme: "light",
    size: "lg",
    showTagline: true,
  },
};

export const GlyphOnly: Story = {
  args: {
    variant: "glyph",
    theme: "light",
    size: "md",
  },
};

export const Favicon: Story = {
  args: {
    variant: "favicon",
    size: "sm",
  },
};

export const Monochrome: Story = {
  render: (args) => (
    <div style={{ color: "var(--color-primary, #1d4ed8)", padding: "var(--space-4)" }}>
      <Logo {...args} variant="horizontal" theme="monochrome" size="md" showTagline={true} />
    </div>
  ),
};

export const WithoutTagline: Story = {
  args: {
    variant: "horizontal",
    size: "md",
    showTagline: false,
  },
};

export const SizeMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <Logo variant="horizontal" size="sm" />
      <Logo variant="horizontal" size="md" />
      <Logo variant="horizontal" size="lg" />
      <Logo variant="horizontal" size="xl" />
    </div>
  ),
};
