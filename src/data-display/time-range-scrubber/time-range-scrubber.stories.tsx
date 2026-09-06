import type { Meta, StoryObj } from "@storybook/react";
import { TimeRangeScrubber } from "./time-range-scrubber";

const meta: Meta<typeof TimeRangeScrubber> = {
  title: "DataDisplay/TimeRangeScrubber",
  component: TimeRangeScrubber,
  parameters: {
    layout: "padded",
  },
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
