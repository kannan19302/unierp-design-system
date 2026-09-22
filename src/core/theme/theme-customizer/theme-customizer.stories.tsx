import type { Meta, StoryObj } from "@storybook/react";
import { ThemeCustomizer } from "./theme-customizer";

const meta: Meta<typeof ThemeCustomizer> = {
  title: "Theme/ThemeCustomizer",
  component: ThemeCustomizer,
  parameters: {
    layout: "padded",
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
