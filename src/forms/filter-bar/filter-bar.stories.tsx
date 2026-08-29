import type { Meta, StoryObj } from "@storybook/react";
import { FilterBar, FilterTag } from "./filter-bar";

const meta: Meta<typeof FilterBar> = {
  title: "Forms/FilterBar",
  component: FilterBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  args: {
    onClearAll: () => alert("Cleared all filters"),
    children: (
      <>
        <FilterTag label="Fiscal Period" value="FY2026-Q1" onRemove={() => {}} />
        <FilterTag label="Status" value="Unposted" onRemove={() => {}} />
        <FilterTag label="Currency" value="USD" onRemove={() => {}} />
      </>
    ),
  },
};
