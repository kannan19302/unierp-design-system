import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, useTheme } from "./theme-provider";
import { THEMES, DENSITIES } from "../../tokens";

const ThemeViewer = () => {
  const { theme, setTheme, density, setDensity } = useTheme();
  return (
    <div style={{ padding: "var(--space-4)", background: "var(--color-surface-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-default)" }}>
      <h3 style={{ margin: "0 0 var(--space-3) 0" }}>Active Theme Context</h3>
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)", flexWrap: "wrap" }}>
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTheme(t)}
            style={{
              padding: "var(--space-1) var(--space-3)",
              background: theme === t ? "var(--color-brand)" : "var(--color-surface-subtle)",
              color: theme === t ? "#fff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: "var(--space-2)" }}>
        {DENSITIES.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDensity(d)}
            style={{
              padding: "var(--space-1) var(--space-3)",
              background: density === d ? "var(--color-brand)" : "var(--color-surface-subtle)",
              color: density === d ? "#fff" : "var(--color-text-primary)",
              border: "1px solid var(--color-border-default)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
            }}
          >
            {d} density
          </button>
        ))}
      </div>
    </div>
  );
};

const meta: Meta<typeof ThemeProvider> = {
  title: "Core/Theme/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Root context provider that propagates active Strata theme (light/dark/high-contrast) and density tiers across all UI components.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeViewer />
    </ThemeProvider>
  ),
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          1. Default Meridian Light Theme
        </h4>
        <ThemeProvider initialTheme="meridian">
          <ThemeViewer />
        </ThemeProvider>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          2. Dark Mode Theme Context
        </h4>
        <ThemeProvider initialTheme="strata-dark">
          <ThemeViewer />
        </ThemeProvider>
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
          3. High-Contrast Enterprise Context
        </h4>
        <ThemeProvider initialTheme="high-contrast">
          <ThemeViewer />
        </ThemeProvider>
      </div>
    </div>
  ),
};
