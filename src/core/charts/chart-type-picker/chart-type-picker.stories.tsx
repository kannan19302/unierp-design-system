import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { ChartTypePicker, type ChartType } from "./chart-type-picker";

const meta: Meta<typeof ChartTypePicker> = {
  title: "Core/Charts/ChartTypePicker",
  component: ChartTypePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof ChartTypePicker>;

const InteractiveDemo = () => {
  const [val, setVal] = useState<ChartType>("bar");
  return (
    <div style={{ inlineSize: "320px", padding: "var(--space-4)" }}>
      <ChartTypePicker value={val} onChange={setVal} />
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveDemo />,
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "340px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <InteractiveDemo />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "340px", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <ChartTypePicker value="bar" onChange={() => {}} />
      <ChartTypePicker value="line" onChange={() => {}} />
      <ChartTypePicker value="pie" onChange={() => {}} />
      <ChartTypePicker value="donut" onChange={() => {}} />
    </div>
  ),
};
