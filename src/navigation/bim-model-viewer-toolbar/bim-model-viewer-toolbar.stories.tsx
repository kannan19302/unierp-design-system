import type { Meta, StoryObj } from "@storybook/react";
import { BimModelViewerToolbar } from "./bim-model-viewer-toolbar";

const meta: Meta<typeof BimModelViewerToolbar> = {
  title: "Navigation/BimModelViewerToolbar",
  component: BimModelViewerToolbar,
  parameters: {
    layout: "padded",
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

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};

export const SectionActive: Story = {
  args: {
    modelName: "High-Rise Residential Tower B - Core Structural Framing.ifc",
    activeCameraMode: "pan",
    activeSectionMode: "x_plane",
    density: "compact",
  },
};
