import type { Meta, StoryObj } from "@storybook/react";
import { TagInput } from "./tag-input";

const meta: Meta<typeof TagInput> = {
  title: "Inputs/TagInput",
  component: TagInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  args: {
    tags: ["Ledger-2026", "Audited", "Consolidated"],
  },
};
