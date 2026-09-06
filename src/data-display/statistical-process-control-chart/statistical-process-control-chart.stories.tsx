import type { Meta, StoryObj } from "@storybook/react";
import {
  StatisticalProcessControlChart,
  SpcSubgroupSample,
} from "./statistical-process-control-chart";

const sampleSubgroups: SpcSubgroupSample[] = [
  { sampleIndex: 1, timestamp: "08:00", meanValue: 85.002, rangeValue: 0.012, isViolation: false },
  { sampleIndex: 2, timestamp: "08:30", meanValue: 85.011, rangeValue: 0.015, isViolation: false },
  { sampleIndex: 3, timestamp: "09:00", meanValue: 84.996, rangeValue: 0.009, isViolation: false },
  { sampleIndex: 4, timestamp: "09:30", meanValue: 85.019, rangeValue: 0.018, isViolation: false },
  { sampleIndex: 5, timestamp: "10:00", meanValue: 85.048, rangeValue: 0.024, isViolation: true, violationRule: "Rule 1: Exceeds Upper Control Limit (+3σ)" },
  { sampleIndex: 6, timestamp: "10:30", meanValue: 85.021, rangeValue: 0.014, isViolation: false },
  { sampleIndex: 7, timestamp: "11:00", meanValue: 85.005, rangeValue: 0.011, isViolation: false },
];

const meta: Meta<typeof StatisticalProcessControlChart> = {
  title: "Data Display/StatisticalProcessControlChart",
  component: StatisticalProcessControlChart,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StatisticalProcessControlChart>;

export const Default: Story = {
  args: {
    processName: "Cylinder Bore Diameter Machining (Station CNC-04)",
    nominalMean: 85.0,
    ucl: 85.045,
    lcl: 84.955,
    unitOfMeasure: "mm",
    subgroups: sampleSubgroups,
  },
};

export const UltraCompact: Story = {
  args: {
    processName: "Cylinder Bore Diameter Machining (Station CNC-04)",
    nominalMean: 85.0,
    ucl: 85.045,
    lcl: 84.955,
    unitOfMeasure: "mm",
    subgroups: sampleSubgroups,
    density: "ultra-compact",
  },
};
