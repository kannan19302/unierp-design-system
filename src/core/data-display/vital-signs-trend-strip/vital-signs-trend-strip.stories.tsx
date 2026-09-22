import type { Meta, StoryObj } from "@storybook/react";
import { VitalSignsTrendStrip, VitalMetricSeries } from "./vital-signs-trend-strip";

const SAMPLE_SERIES: VitalMetricSeries[] = [
  {
    id: "hr",
    label: "Heart Rate",
    code: "HR",
    unit: "bpm",
    currentValue: 74,
    normalMin: 60,
    normalMax: 100,
    status: "normal",
    dataPoints: [
      { time: "08:00", value: 72 },
      { time: "08:15", value: 75 },
      { time: "08:30", value: 71 },
      { time: "08:45", value: 78 },
      { time: "09:00", value: 74 },
    ],
  },
  {
    id: "spo2",
    label: "Pulse Oximetry",
    code: "SpO2",
    unit: "%",
    currentValue: 98,
    normalMin: 95,
    normalMax: 100,
    status: "normal",
    dataPoints: [
      { time: "08:00", value: 99 },
      { time: "08:15", value: 98 },
      { time: "08:30", value: 97 },
      { time: "08:45", value: 98 },
      { time: "09:00", value: 98 },
    ],
  },
  {
    id: "nibp",
    label: "Non-Invasive Blood Pressure",
    code: "NIBP",
    unit: "mmHg",
    currentValue: "148/92",
    normalMin: 90,
    normalMax: 120,
    status: "warning",
    alarmNote: "Stage 1 Hypertension detected",
    dataPoints: [
      { time: "08:00", value: 125 },
      { time: "08:15", value: 132 },
      { time: "08:30", value: 140 },
      { time: "08:45", value: 145 },
      { time: "09:00", value: 148 },
    ],
  },
  {
    id: "temp",
    label: "Core Body Temperature",
    code: "TEMP",
    unit: "°F",
    currentValue: 102.4,
    normalMin: 97.8,
    normalMax: 99.1,
    status: "critical",
    alarmNote: "High Pyrexia (> 102.0°F) Active Warning",
    dataPoints: [
      { time: "08:00", value: 99.2 },
      { time: "08:15", value: 100.1 },
      { time: "08:30", value: 101.3 },
      { time: "08:45", value: 101.9 },
      { time: "09:00", value: 102.4 },
    ],
  },
];

const meta: Meta<typeof VitalSignsTrendStrip> = {
  title: "DataDisplay/VitalSignsTrendStrip",
  component: VitalSignsTrendStrip,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VitalSignsTrendStrip>;

export const DefaultTelemetry: Story = {
  args: {
    subjectTitle: "Patient: John Doe (MRN-90214)",
    locationNote: "Trauma ICU Bed 02 • Continuous Telemetry Lead II",
    series: SAMPLE_SERIES,
  },
};

export const AnatomyAndComposition: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h4>Component Anatomy &amp; Composition</h4>
      <VitalSignsTrendStrip {...args} />
    </div>
  ),
  args: {
    ...DefaultTelemetry.args,
  },
};

export const AllStatesGallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <div>
        <h4>Standard Normal Vitals</h4>
        <VitalSignsTrendStrip
          subjectTitle="General Ward Telemetry"
          locationNote="Bed 12-B"
          series={SAMPLE_SERIES.slice(0, 2)}
        />
      </div>
      <div>
        <h4>Telemetry with Alarm Conditions</h4>
        <VitalSignsTrendStrip
          subjectTitle="Emergency Resuscitation Bay 1"
          locationNote="Telemetry Channel 1"
          series={SAMPLE_SERIES.slice(2)}
        />
      </div>
    </div>
  ),
};

