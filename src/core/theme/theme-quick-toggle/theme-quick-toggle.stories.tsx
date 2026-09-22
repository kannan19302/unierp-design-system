import type { Meta, StoryObj } from "@storybook/react";
import { ThemeQuickToggle } from "./theme-quick-toggle";
import { ThemeProvider } from "../theme-provider/theme-provider";

const meta: Meta<typeof ThemeQuickToggle> = {
  title: "Theme/ThemeQuickToggle",
  component: ThemeQuickToggle,
  parameters: { layout: "centered" },
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
