import type { Meta, StoryObj } from "@storybook/react";
// Tooltip comes from ./overlays, not ./navigation — navigation.tsx has never
// exported it, so this file could not compile. It went unnoticed because
// Storybook was mounted at a path where it found no story files at all.
import { Tabs, Pagination } from "./navigation";
import { Tooltip } from "./overlays";
import { Button } from "./button";

export default { title: "Components/Navigation" } as Meta;

export const TabsExample: StoryObj = {
  render: () => (
    <Tabs
      tabs={[
        { key: "overview", label: "Overview" },
        { key: "details", label: "Details" },
        { key: "history", label: "History" },
      ]}
      value="overview"
      onChange={() => {}}
    />
  ),
};

export const TooltipExample: StoryObj = {
  render: () => (
    <Tooltip content="This is a tooltip">
      <Button variant="outline">Hover me</Button>
    </Tooltip>
  ),
};

export const PaginationExample: StoryObj = {
  render: () => <Pagination page={3} pageCount={10} onChange={() => {}} />,
};
