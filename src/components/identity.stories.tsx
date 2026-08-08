import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, Presence, UserCard, TenantBadge } from "./identity";

const meta: Meta = {
  title: "Components/Identity",
};

export default meta;

export const AvatarDefault: StoryObj = {
  render: () => <Avatar name="Jane Doe" email="jane@example.com" />,
};

export const PresenceDefault: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Presence status="online" />
      <Presence status="away" />
      <Presence status="busy" />
      <Presence status="offline" />
    </div>
  ),
};

export const UserCardDefault: StoryObj = {
  render: () => <UserCard name="Jane Doe" email="jane@example.com" role="Admin" status="online" />,
};

export const TenantBadgeDefault: StoryObj = {
  render: () => <TenantBadge tenantName="Acme Corp" tenantId="tenant-123" />,
};
