import type { Meta, StoryObj } from "@storybook/react";
import { FilterChipGroup } from "./filter-chip-group";

const meta: Meta<typeof FilterChipGroup> = {
  title: "Core/Filters/FilterChipGroup",
  component: FilterChipGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterChipGroup>;

export const Default: Story = {
  args: {
    chips: [
      { id: "c1", field: "Status", label: "Active", value: "active" },
      { id: "c2", field: "Department", label: "Engineering", value: "eng" },
      { id: "c3", field: "Priority", label: "High", value: "high" },
    ],
  },
};
