import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  OmnichannelContactBar,
  CallerProfile,
} from "./omnichannel-contact-bar";

const sampleCaller: CallerProfile = {
  callerNumber: "+1 (415) 890-2134",
  customerName: "AeroDynamics Corp",
  accountReference: "ACC-88201",
  serviceTier: "Diamond 24/7",
};

describe("OmnichannelContactBar", () => {
  it("renders agent state, caller info, and call controls", () => {
    render(
      <OmnichannelContactBar
        initialState="in_call"
        activeCaller={sampleCaller}
      />
    );

    expect(screen.getByText("AeroDynamics Corp")).toBeInTheDocument();
    expect(screen.getByText("+1 (415) 890-2134")).toBeInTheDocument();
    expect(screen.getByText("ACC-88201")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mute Microphone/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /End Call/i })).toBeInTheDocument();
  });

  it("handles mute toggle and end call transitions to wrap up", () => {
    const onEnd = vi.fn();
    render(
      <OmnichannelContactBar
        initialState="in_call"
        activeCaller={sampleCaller}
        onEndCall={onEnd}
      />
    );

    const muteBtn = screen.getByRole("button", { name: /Mute Microphone/i });
    fireEvent.click(muteBtn);
    expect(screen.getByRole("button", { name: /Unmute Microphone/i })).toBeInTheDocument();

    const endBtn = screen.getByRole("button", { name: /End Call/i });
    fireEvent.click(endBtn);
    expect(onEnd).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /Complete Wrap-Up/i })).toBeInTheDocument();
  });

  it("has zero accessibility violations", async () => {
    const { container } = render(
      <OmnichannelContactBar
        initialState="in_call"
        activeCaller={sampleCaller}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
