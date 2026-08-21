import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup, Badge, HealthScore, Presence, PriorityIndicator, Tag, UserChip } from "./identity";

/**
 * Rewritten against the real API. This file previously imported `UserCard` and
 * `TenantBadge` from "./identity" — neither exists anywhere in this package,
 * and never has. The nearest real components are `UserChip` (name + role +
 * presence) and `Badge`/`Tag`, which is what these stories now document.
 *
 * It could not compile, and went unnoticed because Storybook was mounted at a
 * path where it found no story files at all.
 */
const meta: Meta = {
  title: "Components/Identity",
};

export default meta;

export const AvatarDefault: StoryObj = {
  render: () => <Avatar name="Jane Doe" />,
};

export const AvatarGroupDefault: StoryObj = {
  render: () => <AvatarGroup avatars={[{ name: "Jane Doe" }, { name: "Ada Lovelace" }, { name: "Alan Turing" }]} />,
};

export const PresenceDefault: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <Presence status="online" showLabel />
      <Presence status="away" showLabel />
      <Presence status="busy" showLabel />
      <Presence status="offline" showLabel />
    </div>
  ),
};

export const UserChipDefault: StoryObj = {
  render: () => <UserChip name="Jane Doe" role="Admin" status="online" />,
};

export const BadgeDefault: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Badge>Default</Badge>
      <Badge variant="success">Active</Badge>
      <Badge variant="warning">Trial</Badge>
      <Badge variant="danger">Suspended</Badge>
    </div>
  ),
};

export const TagDefault: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Tag>finance</Tag>
      <Tag onRemove={() => {}}>priority</Tag>
    </div>
  ),
};

export const PriorityIndicatorDefault: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 12 }}>
      <PriorityIndicator priority="low" />
      <PriorityIndicator priority="medium" />
      <PriorityIndicator priority="high" />
      <PriorityIndicator priority="urgent" showLabel />
    </div>
  ),
};

export const HealthScoreDefault: StoryObj = {
  render: () => <HealthScore score={82} />,
};
