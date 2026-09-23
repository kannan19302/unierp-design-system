import type { Meta, StoryObj } from "@storybook/react";
import { BreakGlassAction } from "./break-glass-action";

const meta: Meta<typeof BreakGlassAction> = {
  title: "Platforms/ProviderAdmin/SessionSecurity/BreakGlassAction",
  component: BreakGlassAction,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof BreakGlassAction>;

export const Default: Story = {
  args: {
    buttonLabel: "Purge Staging Tenant Data",
    actionLabel: "Purge Database",
    onConfirm: () => {},
  },
};
