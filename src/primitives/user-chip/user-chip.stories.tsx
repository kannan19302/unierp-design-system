import type { Meta, StoryObj } from "@storybook/react";
import { UserChip } from "./user-chip";

const meta: Meta<typeof UserChip> = {
  title: "Primitives/UserChip",
  component: UserChip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UserChip>;

export const Default: Story = {
  args: {
    name: "Alex Rivera",
    role: "Financial Controller",
    status: "online",
  },
};

export const BusyState: Story = {
  args: {
    name: "Dr. Elena Rostova",
    role: "Lead Auditor",
    status: "busy",
  },
};
