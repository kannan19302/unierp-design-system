import type { Meta, StoryObj } from "@storybook/react";
import { AdminAppSwitcher } from "./admin-app-switcher";

const meta: Meta<typeof AdminAppSwitcher> = {
  title: "Platforms/ProviderAdmin/SystemControl/AdminAppSwitcher",
  component: AdminAppSwitcher,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof AdminAppSwitcher>;

export const Default: Story = {
  args: {},
};

export const WithActiveRoute: Story = {
  args: {
    activePath: "/tenants",
  },
};
