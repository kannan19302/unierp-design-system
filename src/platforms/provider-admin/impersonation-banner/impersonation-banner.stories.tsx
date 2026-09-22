import type { Meta, StoryObj } from "@storybook/react";
import { ImpersonationBanner } from "./impersonation-banner";

const meta: Meta<typeof ImpersonationBanner> = {
  title: "Platforms/ProviderAdmin/ImpersonationBanner",
  component: ImpersonationBanner,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ImpersonationBanner>;

export const Active: Story = {
  args: {
    tenantName: "Acme Corporation (acme)",
  },
};
