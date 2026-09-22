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
  title: "Theme/ThemeProvider",
  component: ThemeProvider,
  parameters: { layout: "centered" },
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
