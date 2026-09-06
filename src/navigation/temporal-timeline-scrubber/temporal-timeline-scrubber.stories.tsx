import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TemporalTimelineScrubber } from "./temporal-timeline-scrubber";

const meta: Meta<typeof TemporalTimelineScrubber> = {
  title: "Navigation/TemporalTimelineScrubber",
  component: TemporalTimelineScrubber,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TemporalTimelineScrubber>;

const baseTime = 1788698400000;
const oneHour = 3600000;

const sampleMarkers = [
  { id: "m1", timestamp: baseTime + oneHour * 2, label: "PO Created" },
  { id: "m2", timestamp: baseTime + oneHour * 6, label: "GL Tax Recalculated" },
  { id: "m3", timestamp: baseTime + oneHour * 14, label: "Wire Transfer Released" },
];

export const Default: Story = {
  args: {
    minTimestamp: baseTime,
    maxTimestamp: baseTime + oneHour * 24,
    currentTimestamp: baseTime + oneHour * 8,
    isPlaying: false,
    eventMarkers: sampleMarkers,
    activePreset: "24h",
    density: "standard",
    onTimestampChange: (ts) => alert(`Timestamp: ${ts}`),
    onTogglePlay: () => alert("Toggle playback"),
    onPresetChange: (p) => alert(`Preset changed to: ${p}`),
  },
};

export const Compact: Story = {
  args: {
    minTimestamp: baseTime,
    maxTimestamp: baseTime + oneHour * 24,
    currentTimestamp: baseTime + oneHour * 12,
    density: "compact",
  },
};
