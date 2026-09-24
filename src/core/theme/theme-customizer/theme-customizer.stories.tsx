import type { Meta, StoryObj } from "@storybook/react";
import { ThemeCustomizer } from "./theme-customizer";

const meta: Meta<typeof ThemeCustomizer> = {
  title: "Core/Theme/ThemeCustomizer",
  component: ThemeCustomizer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Live enterprise workbench for configuring tenant brand accents, corner radius, density tiers, and typography scaling.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeCustomizer>;

export const Default: Story = {
  args: {
    initialConfig: {
      tenantName: "Apex Financial Group",
      brandPrimary: "#0e7490",
      brandAccent: "#f59e0b",
      radius: "md",
      density: "standard",
    },
  },
};

export const AllStatesGallery: Story = {
  name: "All states gallery",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)" }}>Default Enterprise Theme Preset</h4>
        <ThemeCustomizer
          initialConfig={{
            tenantName: "Acme Enterprise Corp",
            brandPrimary: "#2563eb",
            brandAccent: "#10b981",
            radius: "md",
            density: "standard",
          }}
        />
      </div>
      <div>
        <h4 style={{ margin: "0 0 var(--space-2) 0", fontSize: "var(--text-sm)" }}>High-Contrast Trading & Ledger Preset</h4>
        <ThemeCustomizer
          initialConfig={{
            tenantName: "Quantitative Capital Partners",
            brandPrimary: "#0f172a",
            brandAccent: "#f59e0b",
            radius: "sm",
            density: "ultra-compact",
          }}
        />
      </div>
    </div>
  ),
};
