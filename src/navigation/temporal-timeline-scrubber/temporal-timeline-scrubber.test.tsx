import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TemporalTimelineScrubber } from "./temporal-timeline-scrubber";

const baseTime = 1700000000000;
const oneHour = 3600000;

describe("TemporalTimelineScrubber", () => {
  it("renders controls and handles play/pause and stepping", () => {
    const handleTogglePlay = vi.fn();
    const handleTimestampChange = vi.fn();

    render(
      <TemporalTimelineScrubber
        minTimestamp={baseTime}
        maxTimestamp={baseTime + oneHour * 10}
        currentTimestamp={baseTime + oneHour * 5}
        onTimestampChange={handleTimestampChange}
        isPlaying={false}
        onTogglePlay={handleTogglePlay}
      />
    );

    const playBtn = screen.getByRole("button", { name: /Play timeline simulation/i });
    fireEvent.click(playBtn);
    expect(handleTogglePlay).toHaveBeenCalled();

    const forwardBtn = screen.getByRole("button", { name: /Step forward/i });
    fireEvent.click(forwardBtn);
    expect(handleTimestampChange).toHaveBeenCalled();
  });

  it("handles preset selection", () => {
    const handlePresetChange = vi.fn();
    render(
      <TemporalTimelineScrubber
        minTimestamp={baseTime}
        maxTimestamp={baseTime + oneHour * 24}
        currentTimestamp={baseTime + oneHour * 5}
        onTimestampChange={() => {}}
        onPresetChange={handlePresetChange}
      />
    );

    const presetBtn = screen.getByRole("button", { name: /Time range preset 7d/i });
    fireEvent.click(presetBtn);
    expect(handlePresetChange).toHaveBeenCalledWith("7d");
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <TemporalTimelineScrubber
        minTimestamp={baseTime}
        maxTimestamp={baseTime + oneHour * 10}
        currentTimestamp={baseTime + oneHour * 5}
        onTimestampChange={() => {}}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
