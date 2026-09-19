import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CanvasMinimapNavigator } from "./canvas-minimap-navigator";

const meta: Meta<typeof CanvasMinimapNavigator> = {
  title: "Navigation/CanvasMinimapNavigator",
  component: CanvasMinimapNavigator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
};

export default meta;
type Story = StoryObj<typeof CanvasMinimapNavigator>;

export const Default: Story = {
  args: {
    zoomPercent: 125,
    viewfinder: { x: 25, y: 20, width: 50, height: 40 },
    density: "standard",
    onPan: (x, y) => console.log(`Pan to: ${x}%, ${y}%`),
    onZoomIn: () => console.log("Zoom in"),
    onZoomOut: () => console.log("Zoom out"),
    onZoomReset: () => console.log("Reset zoom"),
    onZoomToFit: () => console.log("Zoom to fit"),
  },
};

export const Compact: Story = {
  args: {
    zoomPercent: 80,
    viewfinder: { x: 10, y: 15, width: 70, height: 60 },
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-6)", alignItems: "flex-start" }}>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Standard 100% Zoom</p>
        <CanvasMinimapNavigator
          zoomPercent={100}
          viewfinder={{ x: 20, y: 20, width: 60, height: 60 }}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onZoomReset={() => {}}
          onZoomToFit={() => {}}
        />
      </div>
      <div>
        <p style={{ marginBlockEnd: "var(--space-2)", fontWeight: "bold" }}>Over-Zoomed 250%</p>
        <CanvasMinimapNavigator
          zoomPercent={250}
          viewfinder={{ x: 40, y: 40, width: 20, height: 20 }}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onZoomReset={() => {}}
        />
      </div>
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
      <CanvasMinimapNavigator
        density="ultra-compact"
        zoomPercent={50}
        viewfinder={{ x: 0, y: 0, width: 100, height: 100 }}
      />
      <CanvasMinimapNavigator
        density="compact"
        zoomPercent={100}
        viewfinder={{ x: 15, y: 15, width: 70, height: 70 }}
      />
      <CanvasMinimapNavigator
        density="standard"
        zoomPercent={150}
        viewfinder={{ x: 25, y: 25, width: 50, height: 50 }}
      />
      <CanvasMinimapNavigator
        density="comfortable"
        zoomPercent={200}
        viewfinder={{ x: 35, y: 35, width: 30, height: 30 }}
      />
    </div>
  ),
};
