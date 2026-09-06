import type { Meta, StoryObj } from "@storybook/react";
import {
  InpatientAcuityScorecard,
  NewsVitalObservation,
} from "./inpatient-acuity-scorecard";

const sampleVitals: NewsVitalObservation[] = [
  { id: "obs_1", parameterName: "Respiration Rate", valueString: "26 bpm", score: 3, normalRange: "12 - 20 bpm" },
  { id: "obs_2", parameterName: "SpO2 Oxygen Saturation", valueString: "93% on Air", score: 2, normalRange: "≥ 96% on Air" },
  { id: "obs_3", parameterName: "Supplemental Oxygen", valueString: "Yes (4 L/min nasal cannula)", score: 2, normalRange: "No Supplemental O2" },
  { id: "obs_4", parameterName: "Systolic Blood Pressure", valueString: "88 mmHg", score: 3, normalRange: "111 - 219 mmHg" },
  { id: "obs_5", parameterName: "Pulse Rate", valueString: "118 bpm", score: 2, normalRange: "51 - 90 bpm" },
  { id: "obs_6", parameterName: "Consciousness Level (AVPU)", valueString: "Alert", score: 0, normalRange: "Alert (A)" },
  { id: "obs_7", parameterName: "Body Temperature", valueString: "38.6 °C", score: 1, normalRange: "36.1 - 38.0 °C" },
];

const normalVitals: NewsVitalObservation[] = [
  { id: "obs_1", parameterName: "Respiration Rate", valueString: "16 bpm", score: 0, normalRange: "12 - 20 bpm" },
  { id: "obs_2", parameterName: "SpO2 Oxygen Saturation", valueString: "98% on Air", score: 0, normalRange: "≥ 96% on Air" },
  { id: "obs_3", parameterName: "Supplemental Oxygen", valueString: "No", score: 0, normalRange: "No Supplemental O2" },
  { id: "obs_4", parameterName: "Systolic Blood Pressure", valueString: "124 mmHg", score: 0, normalRange: "111 - 219 mmHg" },
  { id: "obs_5", parameterName: "Pulse Rate", valueString: "72 bpm", score: 0, normalRange: "51 - 90 bpm" },
  { id: "obs_6", parameterName: "Consciousness Level (AVPU)", valueString: "Alert", score: 0, normalRange: "Alert (A)" },
  { id: "obs_7", parameterName: "Body Temperature", valueString: "36.8 °C", score: 0, normalRange: "36.1 - 38.0 °C" },
];

const meta: Meta<typeof InpatientAcuityScorecard> = {
  title: "Data Display/InpatientAcuityScorecard",
  component: InpatientAcuityScorecard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof InpatientAcuityScorecard>;

export const CriticalAcuity: Story = {
  args: {
    patientName: "Arthur Pendelton",
    mrn: "MRN-104-9921",
    wardLocation: "ICU Stepdown Bed 04B",
    vitalObservations: sampleVitals,
  },
};

export const NormalAcuity: Story = {
  args: {
    patientName: "Evelyn Reed",
    mrn: "MRN-108-4102",
    wardLocation: "Post-Surgical Ward Bed 12A",
    vitalObservations: normalVitals,
  },
};
