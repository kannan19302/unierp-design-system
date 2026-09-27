import type { Meta, StoryObj } from "@storybook/react";
import { ThemeQuickToggle } from "./theme-quick-toggle";
import { ThemeProvider } from "../theme-provider/theme-provider";

const meta: Meta<typeof ThemeQuickToggle> = {
  title: "Core/Theme/ThemeQuickToggle",
  component: ThemeQuickToggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Compact 1-click theme and light/dark mode switcher designed for top app bars and user preference menus.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeQuickToggle>;

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-4)", background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)" }}>
        <span>Toggle Theme:</span>
        <ThemeQuickToggle />
      </div>
    </ThemeProvider>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Light Mode Context
        </h4>
        <ThemeProvider initialTheme="meridian">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-sm)" }}>
            <span style={{ fontSize: "var(--text-xs)" }}>Active Light Theme:</span>
            <ThemeQuickToggle />
          </div>
        </ThemeProvider>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Dark Mode Context
        </h4>
        <ThemeProvider initialTheme="strata-dark">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-sm)", background: "#18181b", color: "#fafafa" }}>
            <span style={{ fontSize: "var(--text-xs)" }}>Active Dark Theme:</span>
            <ThemeQuickToggle />
          </div>
        </ThemeProvider>
      </div>
    </div>
  ),
};
