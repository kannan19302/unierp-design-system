import type { Meta, StoryObj } from "@storybook/react";
import { SessionExpiryModal } from "./session-expiry-modal";

const meta: Meta<typeof SessionExpiryModal> = {
  title: "Platforms/Identity/Flows/SessionExpiryModal",
  component: SessionExpiryModal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SessionExpiryModal>;

export const Default: Story = {
  args: {
    isOpen: true,
    remainingSeconds: 90,
  },
};
