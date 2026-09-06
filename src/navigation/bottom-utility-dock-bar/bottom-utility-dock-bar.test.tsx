import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "vitest-axe";
import { BottomUtilityDockBar } from "./bottom-utility-dock-bar";

const sampleTools = [
  {
    id: "history",
    label: "Recent Records",
    badgeCount: 2,
    renderPanel: () => <div>History panel content</div>,
  },
  {
    id: "notes",
    label: "Scratchpad",
    renderPanel: () => <div>Notes panel content</div>,
  },
];

describe("BottomUtilityDockBar", () => {
  it("renders dock bar tools and status", () => {
    render(
      <BottomUtilityDockBar
        tools={sampleTools}
        statusText="Ready"
      />
    );

    expect(screen.getByRole("button", { name: /Recent Records/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Scratchpad/i })).toBeInTheDocument();
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });

  it("toggles drawer panel when clicked", () => {
    const handleToolChange = vi.fn();
    render(
      <BottomUtilityDockBar
        tools={sampleTools}
        onToolChange={handleToolChange}
      />
    );

    const historyBtn = screen.getByRole("button", { name: /Recent Records/i });
    fireEvent.click(historyBtn);

    expect(handleToolChange).toHaveBeenCalledWith("history");
    expect(screen.getByText("History panel content")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /Close Recent Records/i });
    fireEvent.click(closeBtn);
    expect(handleToolChange).toHaveBeenCalledWith(null);
  });

  it("passes axe accessibility checks", async () => {
    const { container } = render(
      <BottomUtilityDockBar
        tools={sampleTools}
        statusText="Ready"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
