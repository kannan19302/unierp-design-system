import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { LayoutGrid, List, Table } from "lucide-react";
import { SegmentedControl, type SegmentedControlProps } from "./segmented-control";

const meta: Meta<typeof SegmentedControl> = {
  title: "Inputs/SegmentedControl",
  component: SegmentedControl,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

function InteractiveSegmentedControl(props: Partial<SegmentedControlProps>) {
  const [val, setVal] = useState("month");
  return (
    <SegmentedControl
      value={val}
      onChange={setVal}
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
        { value: "year", label: "Year" },
      ]}
      {...props}
    />
  );
}

export const Default: Story = {
  render: () => <InteractiveSegmentedControl />,
};

export const WithIcons: Story = {
  render: () => {
    const [view, setView] = useState("grid");
    return (
      <SegmentedControl
        value={view}
        onChange={setView}
        options={[
          { value: "grid", label: "Grid", icon: <LayoutGrid size={14} /> },
          { value: "list", label: "List", icon: <List size={14} /> },
          { value: "table", label: "Table", icon: <Table size={14} /> },
        ]}
      />
    );
  },
};

export const Small: Story = {
  render: () => <InteractiveSegmentedControl size="sm" />,
};

export const Large: Story = {
  render: () => <InteractiveSegmentedControl size="lg" />,
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: 400 }}>
      <InteractiveSegmentedControl fullWidth />
    </div>
  ),
};
