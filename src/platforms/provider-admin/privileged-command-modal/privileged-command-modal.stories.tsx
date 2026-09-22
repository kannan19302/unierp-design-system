import type { Meta, StoryObj } from "@storybook/react";
import { PrivilegedCommandModal } from "./privileged-command-modal";

const meta: Meta<typeof PrivilegedCommandModal> = {
  title: "Platforms/ProviderAdmin/PrivilegedCommandModal",
  component: PrivilegedCommandModal,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof PrivilegedCommandModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: "Break-Glass Cell Failover",
    actionName: "Trigger Regional Cell Migration",
    appId: "INFRA",
    targetDescription: "Primary PostgreSQL DB Cluster (us-east-1)",
    onClose: () => {},
  },
};
