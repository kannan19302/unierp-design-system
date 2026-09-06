import type { Meta, StoryObj } from "@storybook/react";
import { VisualInspectionLens, InspectionPin } from "./visual-inspection-lens";

const SAMPLE_PINS: InspectionPin[] = [
  {
    id: "pin-1",
    xPercent: 32,
    yPercent: 45,
    label: "PUNCH-102",
    description: "HVAC duct clearance mismatch with structural steel girder",
    status: "flagged",
  },
  {
    id: "pin-2",
    xPercent: 68,
    yPercent: 28,
    label: "REV-B-NOTE",
    description: "Conduit routing shifted 18 inches north per change order 04",
    status: "resolved",
  },
  {
    id: "pin-3",
    xPercent: 82,
    yPercent: 70,
    label: "QA-PENDING",
    description: "Fire sprinkler head spacing verification required",
    status: "open",
  },
];

const meta: Meta<typeof VisualInspectionLens> = {
  title: "DataDisplay/VisualInspectionLens",
  component: VisualInspectionLens,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VisualInspectionLens>;

export const Default: Story = {
  args: {
    baseImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=1200&auto=format&fit=crop&q=80",
    baseLabel: "Architectural Base Drawing (Rev A)",
    revisedImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80",
    revisedLabel: "As-Built Field Scan (Rev C)",
    initialSplitPercent: 50,
    pins: SAMPLE_PINS,
  },
};

export const OpacityFadeMode: Story = {
  args: {
    baseImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f3?w=1200&auto=format&fit=crop&q=80",
    baseLabel: "Original Blueprint",
    revisedImageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&auto=format&fit=crop&q=80",
    revisedLabel: "Structural Overlay",
    mode: "overlay",
    pins: SAMPLE_PINS,
  },
};
