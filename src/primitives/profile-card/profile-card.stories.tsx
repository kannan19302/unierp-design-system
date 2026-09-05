import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "./profile-card";

const meta: Meta<typeof ProfileCard> = {
  title: "Primitives/ProfileCard",
  component: ProfileCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfileCard>;

export const Compact: Story = {
  args: {
    name: "Jane Doe",
    email: "jane.doe@acme.corp",
    role: "System Administrator",
    variant: "compact",
  },
};

export const Full: Story = {
  args: {
    name: "Jane Doe",
    email: "jane.doe@acme.corp",
    role: "System Administrator",
    tenantName: "Acme Global Industries",
    variant: "full",
  },
};

export const WithAvatar: Story = {
  args: {
    name: "Alex Rivera",
    email: "alex.rivera@unierp.io",
    role: "Chief Financial Officer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=faces",
    variant: "full",
  },
};
