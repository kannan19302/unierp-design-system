import type { Meta, StoryObj } from "@storybook/react";
import {
  DrawingSheetPunchAnnotator,
  type DrawingSheetMeta,
  type PunchItemPin,
} from "./drawing-sheet-punch-annotator";

const sampleSheet: DrawingSheetMeta = {
  sheetNumber: "A-201",
  sheetTitle: "Level 2 Floorplan - West Wing Engineering Lab",
  revisionNumber: "Rev D (IFC)",
  scale: "1/8\" = 1'-0\"",
  projectCode: "PRJ-BLD-882",
};

const samplePins: PunchItemPin[] = [
  {
    id: "pin-1",
    pinNumber: 1,
    posX: 32,
    posY: 38,
    trade: "electrical",
    title: "Conduit Stub-up Out of Tolerance",
    description: "Electrical feed stub-up in Elec Closet 202 is 4 inches south of wall centerline.",
    assignedSubcontractor: "Helix Electric Corp",
    dueDate: "2026-09-12",
    status: "open",
    severity: "critical",
    photoCount: 2,
  },
  {
    id: "pin-2",
    pinNumber: 2,
    posX: 68,
    posY: 28,
    trade: "hvac",
    title: "VAV Box Access Clearance Blocked",
    description: "VAV-2-04 damper actuator is obstructed by cable tray; need minimum 18 inches clearance.",
    assignedSubcontractor: "Apollo Mechanical",
    dueDate: "2026-09-15",
    status: "pending_inspection",
    severity: "standard",
    photoCount: 1,
  },
  {
    id: "pin-3",
    pinNumber: 3,
    posX: 48,
    posY: 70,
    trade: "finishes",
    title: "Drywall Tape Blister & Corner Beading",
    description: "Visible seam cracking and bubbled tape joint on south corridor bulkhead.",
    assignedSubcontractor: "KHS&S Drywall Contractors",
    dueDate: "2026-09-18",
    status: "closed",
    severity: "minor",
  },
];

const meta: Meta<typeof DrawingSheetPunchAnnotator> = {
  title: "Core/Data Display/DrawingSheetPunchAnnotator",
  component: DrawingSheetPunchAnnotator,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    sheet: sampleSheet,
    initialPins: samplePins,
  },
};

export default meta;
type Story = StoryObj<typeof DrawingSheetPunchAnnotator>;

export const Default: Story = {
  args: {},
};

export const UltraCompact: Story = {
  args: {
    density: "ultra-compact",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Standard Blueprint View</h4>
        <DrawingSheetPunchAnnotator sheet={sampleSheet} initialPins={samplePins} density="standard" />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "var(--space-2)", marginBlockStart: 0, marginInline: 0 }}>Ultra-Compact Blueprint View</h4>
        <DrawingSheetPunchAnnotator sheet={sampleSheet} initialPins={samplePins} density="ultra-compact" />
      </div>
    </div>
  ),
};
