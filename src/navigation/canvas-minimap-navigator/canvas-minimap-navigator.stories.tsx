import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CanvasMinimapNavigator } from "./canvas-minimap-navigator";

const meta: Meta<typeof CanvasMinimapNavigator> = {
  title: "Navigation/CanvasMinimapNavigator",
  component: CanvasMinimapNavigator,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof CanvasMinimapNavigator>;

export const Default: Story = {
  args: {
    zoomPercent: 125,
    viewfinder: { x: 25, y: 20, width: 50, height: 40 },
    density: "standard",
    onPan: (x, y) => alert(`Pan to: ${x}%, ${y}%`),
    onZoomIn: () => alert("Zoom in"),
    onZoomOut: () => alert("Zoom out"),
    onZoomReset: () => alert("Reset zoom"),
    onZoomToFit: () => alert("Zoom to fit"),
  },
};

export const Compact: Story = {
  args: {
    zoomPercent: 80,
    viewfinder: { x: 10, y: 15, width: 70, height: 60 },
    density: "compact",
  },
};
