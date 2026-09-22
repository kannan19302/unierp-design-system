import type { Meta, StoryObj } from "@storybook/react";
import { BimModelViewerToolbar } from "./bim-model-viewer-toolbar";

const meta: Meta<typeof BimModelViewerToolbar> = {
  title: "Navigation/BimModelViewerToolbar",
  component: BimModelViewerToolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    a11y: {
      test: "todo",
    },
  },
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof BimModelViewerToolbar>;

export const Default: Story = {
  args: {
    modelName: "Metropolitan Medical Center - East Wing Level 4 MEP.ifc",
    activeCameraMode: "orbit",
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  render: () => (
    <div style={{ inlineSize: "100%", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <BimModelViewerToolbar
        modelName="Metropolitan Medical Center - East Wing Level 4 MEP.ifc"
        activeCameraMode="orbit"
        activeSectionMode="none"
        activeMeasureTool="none"
        density="standard"
      />
    </div>
  ),
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ inlineSize: "100%", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Orbit Mode (Compact Density)
        </h4>
        <BimModelViewerToolbar
          modelName="Metropolitan Medical Center - East Wing Level 4 MEP.ifc"
          activeCameraMode="orbit"
          density="compact"
        />
      </div>

      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Section Plane Active & Distance Measuring
        </h4>
        <BimModelViewerToolbar
          modelName="High-Rise Residential Tower B - Core Structural Framing.ifc"
          activeCameraMode="pan"
          activeSectionMode="x_plane"
          activeMeasureTool="distance"
          density="compact"
        />
      </div>

      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Ultra-Compact Density
        </h4>
        <BimModelViewerToolbar
          modelName="Substation Electrical & Switchgear.ifc"
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};
