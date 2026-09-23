import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TemporalTimelineScrubber } from "./temporal-timeline-scrubber";

const meta: Meta<typeof TemporalTimelineScrubber> = {
  title: "Core/Navigation/TemporalTimelineScrubber",
  component: TemporalTimelineScrubber,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
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
    onTimestampChange: (ts) => console.log(`Timestamp: ${ts}`),
    onTogglePlay: () => console.log("Toggle playback"),
    onPresetChange: (p) => console.log(`Preset changed to: ${p}`),
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

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard Audit Replay Scrubber</p>
        <TemporalTimelineScrubber
          minTimestamp={baseTime}
          maxTimestamp={baseTime + oneHour * 24}
          currentTimestamp={baseTime + oneHour * 6}
          eventMarkers={sampleMarkers}
          onTimestampChange={() => {}}
          onTogglePlay={() => {}}
          onPresetChange={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Compact Scrubber Without Playback</p>
        <TemporalTimelineScrubber
          minTimestamp={baseTime}
          maxTimestamp={baseTime + oneHour * 24}
          currentTimestamp={baseTime + oneHour * 14}
          density="compact"
          onTimestampChange={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <TemporalTimelineScrubber
        minTimestamp={baseTime}
        maxTimestamp={baseTime + oneHour * 24}
        currentTimestamp={baseTime + oneHour * 2}
        density="ultra-compact"
        onTimestampChange={() => {}}
      />
      <TemporalTimelineScrubber
        minTimestamp={baseTime}
        maxTimestamp={baseTime + oneHour * 24}
        currentTimestamp={baseTime + oneHour * 8}
        density="compact"
        onTimestampChange={() => {}}
      />
      <TemporalTimelineScrubber
        minTimestamp={baseTime}
        maxTimestamp={baseTime + oneHour * 24}
        currentTimestamp={baseTime + oneHour * 16}
        density="standard"
        onTimestampChange={() => {}}
      />
      <TemporalTimelineScrubber
        minTimestamp={baseTime}
        maxTimestamp={baseTime + oneHour * 24}
        currentTimestamp={baseTime + oneHour * 22}
        density="comfortable"
        onTimestampChange={() => {}}
      />
    </div>
  ),
};
