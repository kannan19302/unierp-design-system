import type { Meta, StoryObj } from "@storybook/react";
import { EnvironmentBanner } from "./environment-banner";

const meta: Meta<typeof EnvironmentBanner> = {
  title: "Platforms/ProviderAdmin/SystemControl/EnvironmentBanner",
  component: EnvironmentBanner,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EnvironmentBanner>;

export const Development: Story = {
  args: {
    environment: "development",
  },
};

export const Staging: Story = {
  args: {
    environment: "staging",
  },
};

export const TestEnv: Story = {
  args: {
    environment: "test",
  },
};
