import type { Meta, StoryObj } from "@storybook/react";
import { TimeRangeScrubber } from "./time-range-scrubber";

const meta: Meta<typeof TimeRangeScrubber> = {
  title: "DataDisplay/TimeRangeScrubber",
  component: TimeRangeScrubber,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: "select",
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimeRangeScrubber>;

export const DefaultTelemetryWindow: Story = {
  args: {
    initialRange: {
      preset: "24h",
      timezone: "UTC",
      autoRefresh: "30s",
    },
    showBrushSlider: true,
    density: "compact",
  },
};

export const UltraCompactDesk: Story = {
  args: {
    initialRange: {
      preset: "1h",
      timezone: "America/New_York",
      autoRefresh: "10s",
    },
    showBrushSlider: false,
    density: "ultra-compact",
  },
};

export const FullZoomWithBrush: Story = {
  args: {
    initialRange: {
      preset: "7d",
      timezone: "Europe/London",
      autoRefresh: "off",
    },
    showBrushSlider: true,
    density: "standard",
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <TimeRangeScrubber {...args} />
    </div>
  ),
  args: {
    initialRange: {
      preset: "4h",
      timezone: "UTC",
      autoRefresh: "10s",
    },
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        <h4 style={{ marginBottom: "8px" }}>With Brush Slider</h4>
        <TimeRangeScrubber showBrushSlider={true} density="compact" />
      </div>
      <div>
        <h4 style={{ marginBottom: "8px" }}>Ultra Compact (Without Slider)</h4>
        <TimeRangeScrubber showBrushSlider={false} density="ultra-compact" />
      </div>
    </div>
  ),
};

