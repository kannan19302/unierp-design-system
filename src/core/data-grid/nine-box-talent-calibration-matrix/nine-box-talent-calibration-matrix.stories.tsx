import type { Meta, StoryObj } from "@storybook/react";
import {
  NineBoxTalentCalibrationMatrix,
  CalibratedEmployee,
} from "./nine-box-talent-calibration-matrix";

const sampleEmployees: CalibratedEmployee[] = [
  {
    id: "emp-1",
    name: "Elena Rostova",
    role: "Principal Enterprise Architect",
    department: "Platform Engineering",
    performance: 3,
    potential: 3,
    tenureYears: 4.2,
    readinessForPromotion: "ready_now",
  },
  {
    id: "emp-2",
    name: "Marcus Vance",
    role: "VP of Cloud Systems",
    department: "Cloud Operations",
    performance: 3,
    potential: 2,
    tenureYears: 5.5,
  },
  {
    id: "emp-3",
    name: "Dr. Sarah Chen",
    role: "Head of Applied AI",
    department: "Platform Engineering",
    performance: 2,
    potential: 3,
    tenureYears: 2.1,
    readinessForPromotion: "ready_now",
  },
  {
    id: "emp-4",
    name: "Alex Rivera",
    role: "Staff SRE Lead",
    department: "Cloud Operations",
    performance: 2,
    potential: 2,
    tenureYears: 3.0,
  },
  {
    id: "emp-5",
    name: "Devon Bailey",
    role: "Senior Security Specialist",
    department: "Cyber Security",
    performance: 3,
    potential: 1,
    tenureYears: 6.0,
  },
  {
    id: "emp-6",
    name: "Taylor Quinn",
    role: "Frontend Engineer",
    department: "Platform Engineering",
    performance: 1,
    potential: 3,
    tenureYears: 0.8,
  },
  {
    id: "emp-7",
    name: "Jordan Lee",
    role: "Legacy Database Analyst",
    department: "Cloud Operations",
    performance: 1,
    potential: 1,
    tenureYears: 7.2,
  },
];

const meta: Meta<typeof NineBoxTalentCalibrationMatrix> = {
  title: "Core/Data Grid/NineBoxTalentCalibrationMatrix",
  component: NineBoxTalentCalibrationMatrix,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    density: {
      control: { type: "select" },
      options: ["ultra-compact", "compact", "standard", "comfortable"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NineBoxTalentCalibrationMatrix>;

export const Default: Story = {
  args: {
    cycleName: "2026 Executive Leadership Talent Calibration",
    employees: sampleEmployees,
    density: "compact",
  },
};

export const AnatomyAndComposition: Story = {
  args: {
    ...Default.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Default Calibration Matrix (Compact)</h4>
        <NineBoxTalentCalibrationMatrix
          cycleName="2026 Executive Leadership Talent Calibration"
          employees={sampleEmployees}
          density="compact"
        />
      </div>
      <div>
        <h4 style={{ marginBlockEnd: "0.5rem" }}>Ultra-Compact View</h4>
        <NineBoxTalentCalibrationMatrix
          cycleName="2026 Executive Leadership Talent Calibration"
          employees={sampleEmployees}
          density="ultra-compact"
        />
      </div>
    </div>
  ),
};

export const UltraCompact: Story = {
  args: {
    ...Default.args,
    density: "ultra-compact",
  },
};
